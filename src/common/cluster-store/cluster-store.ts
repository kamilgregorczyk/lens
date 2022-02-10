/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */


import { ipcMain, ipcRenderer, webFrame } from "electron";
import { action, comparer, computed, makeObservable, observable } from "mobx";
import { BaseStore, BaseStoreDependencies, BaseStoreParams } from "../base-store";
import { Cluster } from "../cluster/cluster";
import logger from "../../main/logger";
import type { AppEventBus } from "../app-event-bus/event-bus";
import { toJS } from "../utils";
import type { ClusterModel, ClusterId, ClusterState } from "../cluster-types";
import type { ClusterStates } from "../ipc/cluster/states.token";

export interface ClusterStoreModel {
  clusters?: ClusterModel[];
}

export interface ClusterStoreDependencies extends BaseStoreDependencies {
  createCluster: (model: ClusterModel) => Cluster;
  emitClusterStates: ClusterStates;
  readonly appEventBus: AppEventBus;
}

export class ClusterStore extends BaseStore<ClusterStoreModel> {
  protected clusters = observable.map<ClusterId, Cluster>();

  constructor(protected readonly dependencies: ClusterStoreDependencies, baseStoreParams: BaseStoreParams<ClusterStoreModel>) {
    super(dependencies, {
      ...baseStoreParams,
      configName: "lens-cluster-store",
      accessPropertiesByDotNotation: false, // To make dots safe in cluster context names
      syncOptions: {
        equals: comparer.structural,
      },
    });

    makeObservable(this);
    this.load();
  }

  registerIpcListener() {
    logger.info(`[CLUSTER-STORE] start to listen (${webFrame.routingId})`);
    const ipc = ipcMain ?? ipcRenderer;

    ipc?.on("cluster:state", (event, clusterId: ClusterId, state: ClusterState) => {
      this.getById(clusterId)?.setState(state);
    });
  }

  @computed get clustersList(): Cluster[] {
    return Array.from(this.clusters.values());
  }

  @computed get connectedClustersList(): Cluster[] {
    return this.clustersList.filter((c) => !c.disconnected);
  }

  hasClusters() {
    return this.clusters.size > 0;
  }

  getById(id: ClusterId): Cluster | null {
    return this.clusters.get(id) ?? null;
  }

  deleteById(id: ClusterId): void {
    this.clusters.delete(id);
  }

  addCluster(clusterOrModel: ClusterModel | Cluster): Cluster {
    this.dependencies.appEventBus.emit({ name: "cluster", action: "add" });

    const cluster = clusterOrModel instanceof Cluster
      ? clusterOrModel
      : this.dependencies.createCluster(clusterOrModel);

    this.clusters.set(cluster.id, cluster);

    return cluster;
  }

  @action
  protected fromStore({ clusters = [] }: ClusterStoreModel = {}) {
    const currentClusters = new Map(this.clusters);
    const newClusters = new Map<ClusterId, Cluster>();

    // update new clusters
    for (const clusterModel of clusters) {
      try {
        let cluster = currentClusters.get(clusterModel.id);

        if (cluster) {
          cluster.updateModel(clusterModel);
        } else {
          cluster = this.dependencies.createCluster(clusterModel);
        }
        newClusters.set(clusterModel.id, cluster);
      } catch (error) {
        logger.warn(`[CLUSTER-STORE]: Failed to update/create a cluster: ${error}`);
      }
    }

    this.clusters.replace(newClusters);
  }

  toJSON(): ClusterStoreModel {
    return toJS({
      clusters: this.clustersList.map(cluster => cluster.toJSON()),
    });
  }
}
