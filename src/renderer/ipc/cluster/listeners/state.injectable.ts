/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { emitUpdateClusterStateInjectionToken } from "../../../../common/ipc/cluster/state.token";
import clusterStoreInjectable from "../../../clusters/store.injectable";
import { implWithOn } from "../../impl-with-on";

const clusterStateListenerInjectable = implWithOn(emitUpdateClusterStateInjectionToken, (di) => {
  const store = di.inject(clusterStoreInjectable);

  return (clusterId, state) => {
    store.getById(clusterId)?.setState(state);
  };
});

export default clusterStateListenerInjectable;
