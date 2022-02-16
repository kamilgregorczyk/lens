/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { action, observable, IComputedValue, computed, ObservableMap, makeObservable, observe } from "mobx";
import { FSWatcher, watch } from "chokidar";
import fs from "fs";
import path from "path";
import type stream from "stream";
import { bytesToUnits, Disposer, ExtendedObservableMap, iter, noop } from "../../../../common/utils";
import type { KubeConfig } from "@kubernetes/client-node";
import { loadConfigFromString, splitConfig } from "../../../../common/kube-helpers";
import { catalogEntityFromCluster } from "../../../clusters/manager";
import { createHash } from "crypto";
import { homedir } from "os";
import globToRegExp from "glob-to-regexp";
import { inspect } from "util";
import type { UpdateClusterModel } from "../../../../common/cluster-types";
import type { Cluster } from "../../../../common/clusters/cluster";
import type { CatalogEntity } from "../../../../common/catalog/entity/entity";
import type { LensLogger } from "../../../../common/logger";
import type { AddComputedSource } from "../../entity/add-computed-source.injectable";
import type { KubeconfigSyncValue } from "../../../../common/user-preferences";
import type { CreateCluster } from "../../../../common/clusters/create-cluster-injection-token";
import type { ClearAsDeleting } from "../../../clusters/clear-as-deleting.injectable";
import type { GetClusterById } from "../../../../common/clusters/get-by-id.injectable";

/**
 * This is the list of globs of which files are ignored when under a folder sync
 */
const ignoreGlobs = [
  "*.lock", // kubectl lock files
  "*.swp", // vim swap files
  ".DS_Store", // macOS specific
].map(rawGlob => ({
  rawGlob,
  matcher: globToRegExp(rawGlob),
}));

/**
 * This should be much larger than any kubeconfig text file
 *
 * Even if you have a cert-file, key-file, and client-cert files that is only
 * 12kb of extra data (at 4096 bytes each) which allows for around 150 entries.
 */
const folderSyncMaxAllowedFileReadSize = 2 * 1024 * 1024; // 2 MiB
const fileSyncMaxAllowedFileReadSize = 16 * folderSyncMaxAllowedFileReadSize; // 32 MiB

interface Dependencies {
  readonly directoryForKubeConfigs: string;
  readonly logger: LensLogger;
  readonly syncKubeconfigEntries: ObservableMap<string, KubeconfigSyncValue>;
  createCluster: CreateCluster;
  clearAsDeleting: ClearAsDeleting;
  addComputedSource: AddComputedSource;
  getClusterById: GetClusterById;
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

    for (const filePath of this.dependencies.syncKubeconfigEntries.keys()) {
      this.startNewSync(filePath);
    }

    this.syncListDisposer = observe(this.dependencies.syncKubeconfigEntries, change => {
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

    this.sources.set(filePath, this.watchFileChanges(filePath));
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

  /**
   * @internal only use this for testing
   */
  configToModels(rootConfig: KubeConfig, filePath: string): UpdateClusterModel[] {
    const validConfigs = [];

    for (const { config, error } of splitConfig(rootConfig)) {
      if (error) {
        this.dependencies.logger.debug(`context failed validation: ${error}`, { context: config.currentContext, filePath });
      } else {
        validConfigs.push({
          kubeConfigPath: filePath,
          contextName: config.currentContext,
        });
      }
    }

    return validConfigs;
  }

  /**
   * @internal only use this for testing
   */
  @action
  computeDiff(contents: string, source: RootSource, filePath: string): void {
    try {
      const { config, error } = loadConfigFromString(contents);

      if (error) {
        this.dependencies.logger.warn(`encountered errors while loading config: ${error.message}`, { filePath, details: error.details });
      }

      const rawModels = this.configToModels(config, filePath);
      const models = new Map(rawModels.map(m => [m.contextName, m]));

      this.dependencies.logger.debug(`File now has ${models.size} entries`, { filePath });

      for (const [contextName, value] of source) {
        const model = models.get(contextName);

        // remove and disconnect clusters that were removed from the config
        if (!model) {
          // remove from the deleting set, so that if a new context of the same name is added, it isn't marked as deleting
          this.dependencies.clearAsDeleting(value[0].id);

          value[0].disconnect();
          source.delete(contextName);
          this.dependencies.logger.debug(`Removed old cluster from sync`, { filePath, contextName });
          continue;
        }

        // TODO: For the update check we need to make sure that the config itself hasn't changed.
        // Probably should make it so that cluster keeps a copy of the config in its memory and
        // diff against that
        // or update the model and mark it as not needed to be added
        value[0].updateModel(model);
        models.delete(contextName);
        this.dependencies.logger.debug(`Updated old cluster from sync`, { filePath, contextName });
      }

      for (const [contextName, model] of models) {
        // add new clusters to the source
        try {
          const clusterId = createHash("md5").update(`${filePath}:${contextName}`).digest("hex");

          const cluster = this.dependencies.getClusterById(clusterId) || this.dependencies.createCluster({ ...model, id: clusterId });

          if (!cluster.apiUrl) {
            throw new Error("Cluster constructor failed, see above error");
          }

          const entity = catalogEntityFromCluster(cluster);

          if (!filePath.startsWith(this.dependencies.directoryForKubeConfigs)) {
            entity.metadata.labels.file = filePath.replace(homedir(), "~");
          }
          source.set(contextName, [cluster, entity]);

          this.dependencies.logger.debug(`Added new cluster from sync`, { filePath, contextName });
        } catch (error) {
          this.dependencies.logger.warn(`Failed to create cluster from model: ${error}`, { filePath, contextName });
        }
      }
    } catch (error) {
      console.log(error);
      this.dependencies.logger.warn(`Failed to compute diff: ${error}`, { filePath });
      source.clear(); // clear source if we have failed so as to not show outdated information
    }
  }

  /**
   * @internal only call for testing purposes
   */
  diffChangedConfigFor({ filePath, source, stats, maxAllowedFileReadSize }: DiffChangedConfigArgs): Disposer {
    this.dependencies.logger.debug(`file changed`, { filePath });

    if (stats.size >= maxAllowedFileReadSize) {
      this.dependencies.logger.warn(`skipping ${filePath}: size=${bytesToUnits(stats.size)} is larger than maxSize=${bytesToUnits(maxAllowedFileReadSize)}`);
      source.clear();

      return noop;
    }

    // TODO: replace with an AbortController with fs.readFile when we upgrade to Node 16 (after it comes out)
    const fileReader = fs.createReadStream(filePath, {
      mode: fs.constants.O_RDONLY,
    });
    const readStream: stream.Readable = fileReader;
    const decoder = new TextDecoder("utf-8", { fatal: true });
    let fileString = "";
    let closed = false;

    const cleanup = () => {
      closed = true;
      fileReader.close(); // This may not close the stream.

      // Artificially marking end-of-stream, as if the underlying resource had
      // indicated end-of-file by itself, allows the stream to close.
      // This does not cancel pending read operations, and if there is such an
      // operation, the process may still not be able to exit successfully
      // until it finishes.
      fileReader.push(null);
      fileReader.read(0);
      readStream.removeAllListeners();
    };

    readStream
      .on("data", (chunk: Buffer) => {
        try {
          fileString += decoder.decode(chunk, { stream: true });
        } catch (error) {
          this.dependencies.logger.warn(`skipping ${filePath}: ${error}`);
          source.clear();
          cleanup();
        }
      })
      .on("close", () => cleanup())
      .on("error", error => {
        cleanup();
        this.dependencies.logger.warn(`failed to read file: ${error}`, { filePath });
      })
      .on("end", () => {
        if (!closed) {
          this.computeDiff(fileString, source, filePath);
        }
      });

    return cleanup;
  }

  watchFileChanges(filePath: string): [IComputedValue<CatalogEntity[]>, Disposer] {
    const rootSource = new ExtendedObservableMap<string, ObservableMap<string, RootSourceValue>>();
    const derivedSource = computed(() => Array.from(iter.flatMap(rootSource.values(), from => iter.map(from.values(), child => child[1]))));

    let watcher: FSWatcher;

    (async () => {
      try {
        const stat = await fs.promises.stat(filePath);
        const isFolderSync = stat.isDirectory();
        const cleanupFns = new Map<string, Disposer>();
        const maxAllowedFileReadSize = isFolderSync
          ? folderSyncMaxAllowedFileReadSize
          : fileSyncMaxAllowedFileReadSize;

        watcher = watch(filePath, {
          followSymlinks: true,
          depth: isFolderSync ? 0 : 1, // DIRs works with 0 but files need 1 (bug: https://github.com/paulmillr/chokidar/issues/1095)
          disableGlobbing: true,
          ignorePermissionErrors: true,
          usePolling: false,
          awaitWriteFinish: {
            pollInterval: 100,
            stabilityThreshold: 1000,
          },
          atomic: 150, // for "atomic writes"
        });

        watcher
          .on("change", (childFilePath, stats) => {
            const cleanup = cleanupFns.get(childFilePath);

            if (!cleanup) {
            // file was previously ignored, do nothing
              return void this.dependencies.logger.debug(`${inspect(childFilePath)} that should have been previously ignored has changed. Doing nothing`);
            }

            cleanup();
            cleanupFns.set(childFilePath, this.diffChangedConfigFor({
              filePath: childFilePath,
              source: rootSource.getOrInsert(childFilePath, observable.map),
              stats,
              maxAllowedFileReadSize,
            }));
          })
          .on("add", (childFilePath, stats) => {
            if (isFolderSync) {
              const fileName = path.basename(childFilePath);

              for (const ignoreGlob of ignoreGlobs) {
                if (ignoreGlob.matcher.test(fileName)) {
                  return void this.dependencies.logger.info(`ignoring ${inspect(childFilePath)} due to ignore glob: ${ignoreGlob.rawGlob}`);
                }
              }
            }

            cleanupFns.set(childFilePath, this.diffChangedConfigFor({
              filePath: childFilePath,
              source: rootSource.getOrInsert(childFilePath, observable.map),
              stats,
              maxAllowedFileReadSize,
            }));
          })
          .on("unlink", (childFilePath) => {
            cleanupFns.get(childFilePath)?.();
            cleanupFns.delete(childFilePath);
            rootSource.delete(childFilePath);
          })
          .on("error", error => this.dependencies.logger.error(`watching file/folder failed: ${error}`, { filePath }));
      } catch (error) {
        console.log(error.stack);
        this.dependencies.logger.warn(`failed to start watching changes: ${error}`);
      }
    })();

    return [derivedSource, () => {
      watcher?.close();
    }];
  }
}

type RootSourceValue = [Cluster, CatalogEntity];
type RootSource = ObservableMap<string, RootSourceValue>;

interface DiffChangedConfigArgs {
  filePath: string;
  source: RootSource;
  stats: fs.Stats;
  maxAllowedFileReadSize: number;
}
