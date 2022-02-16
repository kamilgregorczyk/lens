/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { action, observable, IComputedValue, computed, ObservableMap, makeObservable, observe } from "mobx";
import { Disposer, iter } from "../../../../common/utils";
import type { CatalogEntity } from "../../../../common/catalog/entity/entity";
import type { LensLogger } from "../../../../common/logger";
import type { AddComputedSource } from "../../entity/add-computed-source.injectable";
import type { KubeconfigSyncValue } from "../../../../common/user-preferences";
import type { WatchFileChanges } from "./watch-file-changes.injectable";

interface Dependencies {
  readonly directoryForKubeConfigs: string;
  readonly logger: LensLogger;
  readonly kubeconfigSyncs: ObservableMap<string, KubeconfigSyncValue>;
  addComputedSource: AddComputedSource;
  watchFileChanges: WatchFileChanges;
}

export class KubeconfigSyncManager {
  protected sources = observable.map<string, [IComputedValue<CatalogEntity[]>, Disposer]>();
  protected syncing = false;
  protected syncListDisposer?: Disposer;
  protected removeSource?: Disposer;

  constructor(protected readonly dependencies: Dependencies) {
    makeObservable(this);
  }

  @action
  startSync(): void {
    if (this.syncing) {
      return;
    }

    this.syncing = true;

    this.dependencies.logger.info(`starting requested syncs`);

    this.removeSource = this.dependencies.addComputedSource(computed(() => (
      Array.from(iter.flatMap(
        this.sources.values(),
        ([entities]) => entities.get(),
      ))
    )));

    // This must be done so that c&p-ed clusters are visible
    this.startNewSync(this.dependencies.directoryForKubeConfigs);

    for (const filePath of this.dependencies.kubeconfigSyncs.keys()) {
      this.startNewSync(filePath);
    }

    this.syncListDisposer = observe(this.dependencies.kubeconfigSyncs, change => {
      switch (change.type) {
        case "add":
          this.startNewSync(change.name);
          break;
        case "delete":
          this.stopOldSync(change.name);
          break;
      }
    });
  }

  @action
  stopSync() {
    this.syncListDisposer?.();

    for (const filePath of this.sources.keys()) {
      this.stopOldSync(filePath);
    }

    this.removeSource?.();
    this.syncing = false;
  }

  @action
  protected startNewSync(filePath: string): void {
    if (this.sources.has(filePath)) {
      // don't start a new sync if we already have one
      return void this.dependencies.logger.debug(`already syncing file/folder`, { filePath });
    }

    this.sources.set(filePath, this.dependencies.watchFileChanges(filePath));
    this.dependencies.logger.info(`starting sync of file/folder`, { filePath });
    this.dependencies.logger.debug(`${this.sources.size} files/folders watched`, { files: Array.from(this.sources.keys()) });
  }

  @action
  protected stopOldSync(filePath: string): void {
    if (!this.sources.delete(filePath)) {
      // already stopped
      return void this.dependencies.logger.debug(`no syncing file/folder to stop`, { filePath });
    }

    this.dependencies.logger.info(`stopping sync of file/folder`, { filePath });
    this.dependencies.logger.debug(`${this.sources.size} files/folders watched`, { files: Array.from(this.sources.keys()) });
  }
}

