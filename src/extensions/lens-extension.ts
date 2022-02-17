/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { InstalledExtension } from "./discovery/discovery";
import { action, observable, makeObservable, computed } from "mobx";
import logger from "../main/logger";
import type { ProtocolHandlerRegistration } from "./registries";
import type { PackageJson } from "type-fest";
import { Disposer, disposer } from "../common/utils";
import { LensExtensionDependencies, extensionDependencies } from "./lens-extension-set-dependencies";
import type { SemVer } from "semver";

export type LensExtensionId = string; // path to manifest (package.json)
export type LensExtensionConstructor = new (...args: ConstructorParameters<typeof LensExtension>) => LensExtension;

export interface LensExtensionManifest {
  /**
   * Name of the extension, must be globally unique
   */
  name: string;

  publisher?: string;
  license?: string;
  author?: PackageJson.Person;
  description: string;

  /**
  The dependencies of the package.
  */
  dependencies?: PackageJson.Dependency;

  /**
  Additional tooling dependencies that are not required for the package to work. Usually test, build, or documentation tooling.
  */
  devDependencies?: PackageJson.Dependency;

  /**
   * The parsed version of the extension
   */
  version: SemVer;

  /**
   * Path to the main side entry point
   */
  main?: string;

  /**
   * Path to the renderer side entry point
   */
  renderer?: string;

  engines: {
    /**
     * supported version range for this extension
     */
    lens: string;
  }
}

export interface RawLensExtensionManifest extends PackageJson {
  name: string;
  version: string;
  main?: string; // path to %ext/dist/main.js
  renderer?: string; // path to %ext/dist/renderer.js
}

export const Disposers = Symbol();

export class LensExtension<Dependencies extends LensExtensionDependencies = LensExtensionDependencies> {
  readonly id: LensExtensionId;
  readonly manifest: LensExtensionManifest;
  readonly manifestPath: string;
  readonly isBundled: boolean;

  protocolHandlers: ProtocolHandlerRegistration[] = [];

  @observable private _isEnabled = false;

  @computed get isEnabled() {
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
