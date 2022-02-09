/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ClusterId } from "../cluster-types";
import type { Cluster } from "../cluster/cluster";
import type { ClusterStore } from "./cluster-store";
import { clusterStoreInjectionToken } from "./cluster-store-injection-token";

export type GetClusterById = (id: ClusterId) => Cluster | undefined;

interface Dependencies {
  store: ClusterStore;
}

const getClusterById = ({ store }: Dependencies): GetClusterById => (
  (id) => store.getById(id)
);

const getClusterByIdInjectable = getInjectable({
  instantiate: (di) => getClusterById({
    store: di.inject(clusterStoreInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getClusterByIdInjectable;
