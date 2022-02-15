/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */


import { action, comparer, computed, makeObservable, observable } from "mobx";
import { BaseStore, BaseStoreDependencies, BaseStoreParams } from "../base-store";
import { Cluster } from "../clusters/cluster";
import logger from "../../main/logger";
import type { AppEventBus } from "../app-event-bus/event-bus";
import { toJS } from "../utils";
import type { ClusterModel, ClusterId } from "../cluster-types";

export interface ClusterStoreModel {
  clusters?: ClusterModel[];
}

export interface ClusterStoreDependencies extends BaseStoreDependencies {
  createCluster: (model: ClusterModel) => Cluster;
  readonly appEventBus: AppEventBus;
}

export class ClusterStore extends BaseStore<ClusterStoreModel> {
  protected clusters = observable.map<ClusterId, Cluster>();

  constructor(protected readonly dependencies: ClusterStoreDependencies, baseStoreParams: BaseStoreParams<ClusterStoreModel>) {
    super(dependencies, {
      ...baseStoreParams,
      name: "lens-cluster-store",
      syncOptions: {
        equals: comparer.structural,
      },
    });

    makeObservable(this);
    this.load();
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
