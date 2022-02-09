/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createClusterStoreInjectable from "../../common/cluster-store/create-cluster-store.injectable";

const clusterStoreInjectableInjectable = getInjectable({
  instantiate: (di) => {
    const createClusterStore = di.inject(createClusterStoreInjectable);

    return createClusterStore({});
  },
  lifecycle: lifecycleEnum.singleton,
});

export default clusterStoreInjectableInjectable;
