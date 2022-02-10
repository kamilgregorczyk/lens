/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ClusterStore } from "../../common/clusters/store";
import { clusterStoreInjectionToken } from "../../common/clusters/store-injection-token";
import createClusterStoreInjectable from "../../common/clusters/create-store.injectable";
import { clusterStatesInjectionToken } from "../../common/ipc/cluster/states.token";

let store: ClusterStore;

const clusterStoreInjectable = getInjectable({
  setup: async (di) => {
    const createClusterStore = di.inject(createClusterStoreInjectable);
    const clusterStates = di.inject(clusterStatesInjectionToken.token);

    store = createClusterStore({});

    // TODO: remove this once cluster state is part of the catalog
    for (const [clusterId, state] of await clusterStates()) {
      store.getById(clusterId)?.setState(state);
    }
  },
  instantiate: () => store,
  injectionToken: clusterStoreInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default clusterStoreInjectable;
