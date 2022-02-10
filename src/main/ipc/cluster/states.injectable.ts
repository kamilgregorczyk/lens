/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { clusterStatesInjectionToken } from "../../../common/ipc/cluster/states.token";
import clusterStoreInjectable from "../../clusters/store.injectable";
import { implWithHandle } from "../impl-with-handle";

const clusterStatesInjectable = implWithHandle(clusterStatesInjectionToken, (di) => {
  const store = di.inject(clusterStoreInjectable);

  return async () => store.clustersList.map(cluster => [cluster.id, cluster.getState()]);
});

export default clusterStatesInjectable;
