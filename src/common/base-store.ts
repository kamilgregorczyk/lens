/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import path from "path";
import Config from "conf";
import type { Options as ConfOptions } from "conf/dist/source/types";
import { ipcMain, ipcRenderer } from "electron";
import { comparer, IEqualsComparer, makeObservable, reaction, runInAction } from "mobx";
import { toJS, Disposer, getAppVersion } from "./utils";
import isEqual from "lodash/isEqual";
import { isTestEnv } from "./vars";
import type { LensLogger } from "./logger";

export interface StoreSyncOptions<T> {
  fireImmediately?: boolean;
  equals?: IEqualsComparer<T>;
}

export interface BaseStoreParams<T> extends ConfOptions<T> {
  syncOptions?: StoreSyncOptions<T>;
}

export interface BaseStoreDependencies {
  readonly userDataPath: string;
  readonly logger: LensLogger;
}

/**
 * `T` MUST be JSON serializable
 */
export abstract class BaseStore<T> {
  protected storeConfig?: Config<T>;
  protected syncDisposers: Disposer[] = [];
  protected readonly syncOptions: StoreSyncOptions<T>;
  protected readonly params: ConfOptions<T>;
  protected readonly logger: LensLogger;

  constructor({ logger, userDataPath }: BaseStoreDependencies, baseStoreParams: BaseStoreParams<T>) {
    makeObservable(this);

    const {
      syncOptions = {
        equals: comparer.structural,
      },
      cwd = userDataPath,
      ...params
    } = baseStoreParams;

    this.syncOptions = syncOptions;
    this.params = {
      ...params,
      projectName: "lens",
      projectVersion: getAppVersion(),
      cwd,
      accessPropertiesByDotNotation: false,
    };
    this.logger = logger;
  }

  /**
   * This must be called after the last child's constructor is finished (or just before it finishes)
   */
  load() {
    if (!isTestEnv) {
      this.logger.info(`LOADING from ${this.path} ...`);
    }

    if (this.storeConfig) {
      throw new Error(`Cannot load store for ${this.path} more than once`);
    }

    this.storeConfig = new Config(this.params);
    const res: any = this.fromStore(this.storeConfig.store);

    if (res instanceof Promise || (typeof res === "object" && res && typeof res.then === "function")) {
      this.logger.error(`This class's fromStore implementation returns a Promise or promise-like object. This is an error and MUST be fixed.`);
    }

    this.enableSync();

    if (!isTestEnv) {
      this.logger.info(`LOADED from ${this.path}`);
    }
  }

  get name() {
    return path.basename(this.path);
  }

  protected get syncRendererChannel() {
    return `store-sync-renderer:${this.path}`;
  }

  protected get syncMainChannel() {
    return `store-sync-main:${this.path}`;
  }

  get path() {
    return this.storeConfig?.path || "";
  }

  protected saveToFile(model: T) {
    this.logger.info(`[STORE]: SAVING ${this.path}`);

    // todo: update when fixed https://github.com/sindresorhus/conf/issues/114
    if (this.storeConfig) {
      for (const [key, value] of Object.entries(model)) {
        this.storeConfig.set(key, value);
      }
    }
  }

  enableSync() {
    this.syncDisposers.push(
      reaction(
        () => toJS(this.toJSON()), // unwrap possible observables and react to everything
        model => this.onModelChange(model),
        this.syncOptions,
      ),
    );

    if (ipcMain) {
      this.syncDisposers.push(ipcMainOn(this.syncMainChannel, (event, model: T) => {
        this.logger.debug(`[STORE]: SYNC ${this.name} from renderer`, { model });
        this.onSync(model);
      }));
    }

    if (ipcRenderer) {
      this.syncDisposers.push(ipcRendererOn(this.syncRendererChannel, (event, model: T) => {
        this.logger.debug(`[STORE]: SYNC ${this.name} from main`, { model });
        this.onSyncFromMain(model);
      }));
    }
  }

  protected onSyncFromMain(model: T) {
    this.applyWithoutSync(() => {
      this.onSync(model);
    });
  }

  disableSync() {
    this.syncDisposers.forEach(dispose => dispose());
    this.syncDisposers.length = 0;
  }

  protected applyWithoutSync(callback: () => void) {
    this.disableSync();
    runInAction(callback);
    this.enableSync();
  }

  protected onSync(model: T) {
    // todo: use "resourceVersion" if merge required (to avoid equality checks => better performance)
    if (!isEqual(this.toJSON(), model)) {
      this.fromStore(model);
    }
  }

  protected onModelChange(model: T) {
    if (ipcMain) {
      this.saveToFile(model); // save config file
      broadcastMessage(this.syncRendererChannel, model);
    } else {
      broadcastMessage(this.syncMainChannel, model);
    }
  }

  /**
   * fromStore is called internally when a child class syncs with the file
   * system.
   *
   * Note: This function **must** be synchronous.
   *
   * @param data the parsed information read from the stored JSON file
   */
  protected abstract fromStore(data: T): void;

  /**
   * toJSON is called when syncing the store to the filesystem. It should
   * produce a JSON serializable object representation of the current state.
   *
   * It is recommended that a round trip is valid. Namely, calling
   * `this.fromStore(this.toJSON())` shouldn't change the state.
   */
  abstract toJSON(): T;
}
