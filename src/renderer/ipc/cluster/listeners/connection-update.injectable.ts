/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { emitConnectionUpdateInjectionToken } from "../../../../common/ipc/cluster/connection-update.token";
import clusterConnectionStatusStateInjectable from "../../../components/cluster-manager/status-state.injectable";
import { implWithOn } from "../../impl-with-on";

const clusterConnectionUpdateListenerInjectable = implWithOn(emitConnectionUpdateInjectionToken, (di) => {
  const state = di.inject(clusterConnectionStatusStateInjectable);

  return (clusterId, update) => state.push(clusterId, update);
}, false);

export default clusterConnectionUpdateListenerInjectable;
