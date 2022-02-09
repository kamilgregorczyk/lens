/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { clusterStoreInjectionToken } from "../../common/cluster-store/cluster-store-injection-token";
import createClusterStoreInjectable from "../../common/cluster-store/create-cluster-store.injectable";

const clusterStoreInjectable = getInjectable({
  instantiate: (di) => {
    const createClusterStore = di.inject(createClusterStoreInjectable);

    return createClusterStore({});
  },
  injectionToken: clusterStoreInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default clusterStoreInjectable;
