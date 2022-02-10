/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { setClusterAsVisibleInjectionToken } from "../../../common/ipc/cluster/set-as-visible.token";
import clusterManagerInjectable from "../../clusters/manager.injectable";
import { implWithOn } from "../impl-with-on";

const setClusterAsVisibleInjectable = implWithOn(setClusterAsVisibleInjectionToken, (di) => {
  const clusterManager = di.inject(clusterManagerInjectable);

  return (clusterId) => clusterManager.visibleCluster = clusterId;
});

export default setClusterAsVisibleInjectable;
