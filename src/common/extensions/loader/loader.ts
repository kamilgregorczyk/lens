/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { ipcRenderer } from "electron";
import { EventEmitter } from "events";
import { isEqual } from "lodash";
import { action, makeObservable, reaction } from "mobx";
import path from "path";
import type { Disposer } from "../../utils";
import type { KubernetesCluster } from "../../../extensions/common-api/catalog";
import type { LensExtension, LensExtensionConstructor, LensExtensionId } from "../../../extensions/lens-extension";
import type { LensRendererExtension } from "../../../extensions/lens-renderer-extension";
import * as registries from "../../../extensions/registries";
import type { LensExtensionState } from "../preferences/store";
import type { InstalledExtension } from "../installed.injectable";
import type { CreateExtensionInstance } from "./create-extension-instance.injectable";
import type { LensLogger } from "../../logger";

interface Dependencies {
  updateExtensionsState: (extensionsState: Record<LensExtensionId, LensExtensionState>) => void
  createExtensionInstance: CreateExtensionInstance;
  readonly logger: LensLogger;
}

export interface ExtensionLoading {
  isBundled: boolean,
  loaded: Promise<void>
}

/**
 * Loads installed extensions to the Lens application
 */
export class ExtensionLoader {
  // emits event "remove" of type LensExtension when the extension is removed
  private events = new EventEmitter();

  constructor(protected dependencies: Dependencies) {
    makeObservable(this);
  }

  @action
  async init() {
    if (ipcRenderer) {
      await this.initRenderer();
    } else {
      await this.initMain();
    }

    await Promise.all([this.whenLoaded]);

    // broadcasting extensions between main/renderer processes
    reaction(() => this.toJSON(), () => this.broadcastExtensions(), {
      fireImmediately: true,
    });

    reaction(
      () => this.storeState,

      (state) => {
        this.dependencies.updateExtensionsState(state);
      },
    );
  }

  initExtensions(extensions?: Map<LensExtensionId, InstalledExtension>) {
    this.extensions.replace(extensions);
  }

  addExtension(extension: InstalledExtension) {
    this.extensions.set(extension.id, extension);
  }

  @action
  removeInstance(lensExtensionId: LensExtensionId) {
    this.dependencies.logger.info(`deleting extension instance ${lensExtensionId}`);
    const instance = this.instances.get(lensExtensionId);

    if (!instance) {
      return;
    }

    try {
      instance.disable();
      this.events.emit("remove", instance);
      this.instances.delete(lensExtensionId);
      this.nonInstancesByName.delete(instance.name);
    } catch (error) {
      this.dependencies.logger.error(`deactivation extension error`, { lensExtensionId, error });
    }
  }

  removeExtension(lensExtensionId: LensExtensionId) {
    this.removeInstance(lensExtensionId);

    if (!this.extensions.delete(lensExtensionId)) {
      throw new Error(`Can't remove extension ${lensExtensionId}, doesn't exist.`);
    }
  }

  setIsEnabled(lensExtensionId: LensExtensionId, isEnabled: boolean) {
    this.extensions.get(lensExtensionId).isEnabled = isEnabled;
  }

  protected async initMain() {
    this.isLoaded = true;
    this.loadOnMain();

    ipcMainHandle(extensionLoaderFromMainChannel, () => {
      return Array.from(this.toJSON());
    });

    ipcMainOn(extensionLoaderFromRendererChannel, (event, extensions: [LensExtensionId, InstalledExtension][]) => {
      this.syncExtensions(extensions);
    });
  }

  protected async initRenderer() {
    const extensionListHandler = (extensions: [LensExtensionId, InstalledExtension][]) => {
      this.isLoaded = true;
      this.syncExtensions(extensions);

      const receivedExtensionIds = extensions.map(([lensExtensionId]) => lensExtensionId);

      // Remove deleted extensions in renderer side only
      this.extensions.forEach((_, lensExtensionId) => {
        if (!receivedExtensionIds.includes(lensExtensionId)) {
          this.removeExtension(lensExtensionId);
        }
      });
    };

    requestExtensionLoaderInitialState().then(extensionListHandler);
    ipcRendererOn(extensionLoaderFromMainChannel, (event, extensions: [LensExtensionId, InstalledExtension][]) => {
      extensionListHandler(extensions);
    });
  }

  broadcastExtensions() {
    const channel = ipcRenderer
      ? extensionLoaderFromRendererChannel
      : extensionLoaderFromMainChannel;

    broadcastMessage(channel, Array.from(this.extensions));
  }

  syncExtensions(extensions: [LensExtensionId, InstalledExtension][]) {
    extensions.forEach(([lensExtensionId, extension]) => {
      if (!isEqual(this.extensions.get(lensExtensionId), extension)) {
        this.extensions.set(lensExtensionId, extension);
      }
    });
  }

  loadOnMain() {
    this.autoInitExtensions(() => Promise.resolve([]));
  }

  loadOnClusterManagerRenderer = () => {
    this.dependencies.logger.debug(`load on main renderer (cluster manager)`);

    return this.autoInitExtensions(async (extension: LensRendererExtension) => {
      const removeItems = [
        registries.GlobalPageRegistry.getInstance().add(extension.globalPages, extension),
        registries.EntitySettingRegistry.getInstance().add(extension.entitySettings),
        registries.CatalogEntityDetailRegistry.getInstance().add(extension.catalogEntityDetailItems),
      ];

      this.events.on("remove", (removedExtension: LensRendererExtension) => {
        if (removedExtension.id === extension.id) {
          removeItems.forEach(remove => {
            remove();
          });
        }
      });

      return removeItems;
    });
  };

  loadOnClusterRenderer = (getCluster: () => KubernetesCluster) => {
    this.dependencies.logger.debug(`load on cluster renderer (dashboard)`);

    this.autoInitExtensions(async (extension: LensRendererExtension) => {
      // getCluster must be a callback, as the entity might be available only after an extension has been loaded
      if ((await extension.isEnabledForCluster(getCluster())) === false) {
        return [];
      }

      const removeItems = [
        registries.ClusterPageRegistry.getInstance().add(extension.clusterPages, extension),
        registries.ClusterPageMenuRegistry.getInstance().add(extension.clusterPageMenus, extension),
        registries.KubeObjectDetailRegistry.getInstance().add(extension.kubeObjectDetailItems),
        registries.KubeObjectStatusRegistry.getInstance().add(extension.kubeObjectStatusTexts),
        registries.WorkloadsOverviewDetailRegistry.getInstance().add(extension.kubeWorkloadsOverviewItems),
      ];

      this.events.on("remove", (removedExtension: LensRendererExtension) => {
        if (removedExtension.id === extension.id) {
          removeItems.forEach(remove => {
            remove();
          });
        }
      });

      return removeItems;
    });
  };

  protected async loadExtensions(installedExtensions: Map<string, InstalledExtension>, register: (ext: LensExtension) => Promise<Disposer[]>) {
    // Steps of the function:
    // 1. require and call .activate for each Extension
    // 2. Wait until every extension's onActivate has been resolved
    // 3. Call .enable for each extension
    // 4. Return ExtensionLoading[]

    const extensions = [...installedExtensions.entries()]
      .map(([extId, extension]) => {
        const alreadyInit = this.instances.has(extId) || this.nonInstancesByName.has(extension.manifest.name);

        if (extension.isCompatible && extension.isEnabled && !alreadyInit) {
          try {
            const LensExtensionClass = this.requireExtension(extension);

            if (!LensExtensionClass) {
              this.nonInstancesByName.add(extension.manifest.name);

              return null;
            }

            const instance = this.dependencies.createExtensionInstance(
              LensExtensionClass,
              extension,
            );

            this.instances.set(extId, instance);

            return {
              instance,
              installedExtension: extension,
              activated: instance.activate(),
            };
          } catch (err) {
            this.dependencies.logger.error(`error loading extension`, { ext: extension, err });
          }
        } else if (!extension.isEnabled && alreadyInit) {
          this.removeInstance(extId);
        }

        return null;
      })
      // Remove null values
      .filter(extension => Boolean(extension));

    // We first need to wait until each extension's `onActivate` is resolved or rejected,
    // as this might register new catalog categories. Afterwards we can safely .enable the extension.
    await Promise.all(
      extensions.map(extension =>
        // If extension activation fails, log error
        extension.activated.catch((error) => {
          this.dependencies.logger.error(`activation extension error`, { ext: extension.installedExtension, error });
        }),
      ),
    );

    // Return ExtensionLoading[]
    return extensions.map(extension => {
      const loaded = extension.instance.enable(register).catch((err) => {
        this.dependencies.logger.error(`failed to enable`, { ext: extension, err });
      });

      return {
        isBundled: extension.installedExtension.isBundled,
        loaded,
      };
    });
  }

  protected autoInitExtensions(register: (ext: LensExtension) => Promise<Disposer[]>) {
    // Setup reaction to load extensions on JSON changes
    reaction(() => this.toJSON(), installedExtensions => this.loadExtensions(installedExtensions, register));

    // Load initial extensions
    return this.loadExtensions(this.toJSON(), register);
  }

  protected requireExtension(extension: InstalledExtension): LensExtensionConstructor | null {
    const entryPointName = ipcRenderer ? "renderer" : "main";
    const extRelativePath = extension.manifest[entryPointName];

    if (!extRelativePath) {
      return null;
    }

    const extAbsolutePath = path.resolve(path.join(path.dirname(extension.manifestPath), extRelativePath));

    try {
      return __non_webpack_require__(extAbsolutePath).default;
    } catch (error) {
      if (ipcRenderer) {
        console.error(`can't load ${entryPointName} for "${extension.manifest.name}": ${error.stack || error}`, extension);
      } else {
        this.dependencies.logger.error(`can't load ${entryPointName} for "${extension.manifest.name}": ${error}`, { extension });
      }
    }

    return null;
  }
}
