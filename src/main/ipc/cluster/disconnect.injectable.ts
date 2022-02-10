/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import appEventBusInjectable from "../../../common/app-event-bus/app-event-bus.injectable";
import getClusterByIdInjectable from "../../../common/cluster-store/get-cluster-by-id.injectable";
import { disconnectClusterInjectionToken } from "../../../common/ipc/cluster/disconnect.token";
import clusterFramesInjectable from "../../clusters/frames.injectable";
import { implWithHandle } from "../impl-with-handle";

const disconnectClusterInjectable = implWithHandle(disconnectClusterInjectionToken, (di) => {
  const getClusterById = di.inject(getClusterByIdInjectable);
  const clusterFrames = di.inject(clusterFramesInjectable);
  const appEventBus = di.inject(appEventBusInjectable);

  return async (id) => {
    appEventBus.emit({ name: "cluster", action: "stop" });
    const cluster = getClusterById(id);

    if (cluster) {
      cluster.disconnect();
      clusterFrames.delete(id);
    }
  };
});

export default disconnectClusterInjectable;
