/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { ClusterManager } from "./manager";
import clusterStoreInjectable from "./store.injectable";

const clusterManagerInjectable = getInjectable({
  instantiate: (di) => new ClusterManager({
    store: di.inject(clusterStoreInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default clusterManagerInjectable;
