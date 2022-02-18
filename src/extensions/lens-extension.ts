/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { action, observable, makeObservable } from "mobx";
import logger from "../main/logger";
import type { ProtocolHandlerRegistration } from "./registries";
import { Disposer, disposer } from "../common/utils";
import { LensExtensionDependencies, extensionDependencies } from "./lens-extension-set-dependencies";
import type { SemVer } from "semver";
import type { InstalledExtension } from "../common/extensions/installed.injectable";
import type { LensExtensionId, LensExtensionManifest } from "../common/extensions/manifest";

export type LensExtensionConstructor = new (...args: ConstructorParameters<typeof LensExtension>) => LensExtension;

export const Disposers = Symbol();

export class LensExtension<Dependencies extends LensExtensionDependencies = LensExtensionDependencies> {
  readonly id: LensExtensionId;
  readonly manifest: LensExtensionManifest;
  readonly manifestPath: string;
  readonly isBundled: boolean;

  protocolHandlers: ProtocolHandlerRegistration[] = [];

  @observable private _isEnabled = false;

  /**
   * This is a marker for "has been enabled", not "should be enabled"
   */
  get isEnabled() {
    return this._isEnabled;
  }

  [Disposers] = disposer();

  constructor({ id, manifest, manifestPath, isBundled }: InstalledExtension) {
    makeObservable(this);
    this.id = id;
    this.manifest = manifest;
    this.manifestPath = manifestPath;
    this.isBundled = !!isBundled;
  }

  get name() {
    return this.manifest.name;
  }

  get version() {
    return this.manifest.version;
  }

  get description() {
    return this.manifest.description;
  }

  /**
   * @internal
   */
  [extensionDependencies]: Dependencies;

  /**
   * getExtensionFileFolder returns the path to an already created folder. This
   * folder is for the sole use of this extension.
   *
   * Note: there is no security done on this folder, only obfuscation of the
   * folder name.
   */
  getExtensionFileFolder(): Promise<string> {
    return this[extensionDependencies].requestDirectory(this.id);
  }

  @action
  async enable(register: (ext: LensExtension) => Promise<Disposer[]>) {
    if (this._isEnabled) {
      return;
    }

    try {
      this._isEnabled = true;

      this[Disposers].push(...await register(this));
      logger.info(`[EXTENSION]: enabled ${this.name}@${this.version}`);
    } catch (error) {
      logger.error(`[EXTENSION]: failed to activate ${this.name}@${this.version}: ${error}`);
    }
  }

  @action
  async disable() {
    if (!this._isEnabled) {
      return;
    }

    this._isEnabled = false;

    try {
      await this.onDeactivate();
      this[Disposers]();
      logger.info(`[EXTENSION]: disabled ${this.name}@${this.version}`);
    } catch (error) {
      logger.error(`[EXTENSION]: disabling ${this.name}@${this.version} threw an error: ${error}`);
    }
  }

  async activate(): Promise<void> {
    return this.onActivate();
  }

  protected onActivate(): Promise<void> | void {
    return;
  }

  protected onDeactivate(): Promise<void> | void {
    return;
  }
}

export function sanitizeExtensionName(name: string) {
  return name.replace("@", "").replace("/", "--");
}

export function extensionDisplayName(name: string, version: SemVer) {
  return `${name}@${version.format()}`;
}
