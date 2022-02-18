/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { action, computed, observable } from "mobx";
import * as uuid from "uuid";
import type { LensLogger } from "../../logger";
import { ExtendableDisposer, disposer } from "../../utils";

export enum ExtensionInstallationState {
  INSTALLING = "installing",
  UNINSTALLING = "uninstalling",
  IDLE = "idle",
}

export interface ExtensionInstallationStateStoreDependencies {
  readonly logger: LensLogger;
}

export class ExtensionInstallationStateManager {
  private preInstallIds = observable.set<string>();
  private uninstallingExtensions = observable.set<string>();
  private installingExtensions = observable.set<string>();

  constructor(protected readonly dependencies: ExtensionInstallationStateStoreDependencies) {}

  /**
   * Strictly transitions an extension from not installing to installing
   * @param extId the ID of the extension
   * @throws if state is not IDLE
   */
  @action setInstalling = (extId: string): void => {
    this.dependencies.logger.debug(`trying to set ${extId} as installing`);

    const curState = this.getInstallationState(extId);

    if (curState !== ExtensionInstallationState.IDLE) {
      throw new Error(`cannot set ${extId} as installing. Is currently ${curState}.`);
    }

    this.installingExtensions.add(extId);
  };

  /**
   * Marks the start of a pre-install phase of an extension installation. The
   * part of the installation before the tarball has been unpacked and the ID
   * determined.
   * @returns a disposer which should be called to mark the end of the install phase
   */
  @action startPreInstall = (): ExtendableDisposer => {
    const preInstallStepId = uuid.v4();

    this.dependencies.logger.debug(`starting a new preinstall phase: ${preInstallStepId}`);
    this.preInstallIds.add(preInstallStepId);

    return disposer(() => {
      this.preInstallIds.delete(preInstallStepId);
      this.dependencies.logger.debug(`ending a preinstall phase: ${preInstallStepId}`);
    });
  };

  /**
   * Strictly transitions an extension from not uninstalling to uninstalling
   * @param extId the ID of the extension
   * @throws if state is not IDLE
   */
  @action setUninstalling = (extId: string): void => {
    this.dependencies.logger.debug(`trying to set ${extId} as uninstalling`);

    const curState = this.getInstallationState(extId);

    if (curState !== ExtensionInstallationState.IDLE) {
      throw new Error(`cannot set ${extId} as uninstalling. Is currently ${curState}.`);
    }

    this.uninstallingExtensions.add(extId);
  };

  /**
   * Strictly clears the INSTALLING state of an extension
   * @param extId The ID of the extension
   * @throws if state is not INSTALLING
   */
  @action clearInstalling = (extId: string): void => {
    this.dependencies.logger.debug(`trying to clear ${extId} as installing`);

    const curState = this.getInstallationState(extId);

    switch (curState) {
      case ExtensionInstallationState.INSTALLING:
        return void this.installingExtensions.delete(extId);
      default:
        throw new Error(`cannot clear INSTALLING state for ${extId}, it is currently ${curState}`);
    }
  };

  /**
   * Strictly clears the UNINSTALLING state of an extension
   * @param extId The ID of the extension
   * @throws if state is not UNINSTALLING
   */
  @action clearUninstalling = (extId: string): void => {
    this.dependencies.logger.debug(`trying to clear ${extId} as uninstalling`);

    const curState = this.getInstallationState(extId);

    switch (curState) {
      case ExtensionInstallationState.UNINSTALLING:
        return void this.uninstallingExtensions.delete(extId);
      default:
        throw new Error(`cannot clear UNINSTALLING state for ${extId}, it is currently ${curState}`);
    }
  };

  /**
   * Returns the current state of the extension. IDLE is default value.
   * @param extId The ID of the extension
   */
  getInstallationState = (extId: string): ExtensionInstallationState => {
    if (this.installingExtensions.has(extId)) {
      return ExtensionInstallationState.INSTALLING;
    }

    if (this.uninstallingExtensions.has(extId)) {
      return ExtensionInstallationState.UNINSTALLING;
    }

    return ExtensionInstallationState.IDLE;
  };

  /**
   * Returns true if the extension is currently INSTALLING
   * @param extId The ID of the extension
   */
  isExtensionInstalling = (extId: string): boolean =>
    this.getInstallationState(extId) === ExtensionInstallationState.INSTALLING;

  /**
   * Returns true if the extension is currently UNINSTALLING
   * @param extId The ID of the extension
   */
  isExtensionUninstalling = (extId: string): boolean =>
    this.getInstallationState(extId) ===
    ExtensionInstallationState.UNINSTALLING;

  /**
   * Returns true if the extension is currently IDLE
   * @param extId The ID of the extension
   */
  isExtensionIdle = (extId: string): boolean =>
    this.getInstallationState(extId) === ExtensionInstallationState.IDLE;

  /**
   * The current number of extensions installing
   */
  @computed get installing(): number {
    return this.installingExtensions.size;
  }

  /**
   * The current number of extensions uninstalling
   */
  get uninstalling(): number {
    return this.uninstallingExtensions.size;
  }

  /**
   * If there is at least one extension currently installing
   */
  get anyInstalling(): boolean {
    return this.installing > 0;
  }

  /**
   * If there is at least one extension currently uninstalling
   */
  get anyUninstalling(): boolean {
    return this.uninstalling > 0;
  }

  /**
   * The current number of extensions preinstalling
   */
  get preinstalling(): number {
    return this.preInstallIds.size;
  }

  /**
   * If there is at least one extension currently downloading
   */
  get anyPreinstalling(): boolean {
    return this.preinstalling > 0;
  }

  /**
   * If there is at least one installing or preinstalling step taking place
   */
  get anyPreInstallingOrInstalling(): boolean {
    return this.anyInstalling || this.anyPreinstalling;
  }
}
