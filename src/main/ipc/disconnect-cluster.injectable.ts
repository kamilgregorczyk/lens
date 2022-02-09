/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import appEventBusInjectable from "../../common/app-event-bus/app-event-bus.injectable";
import getClusterByIdInjectable from "../../common/cluster-store/get-cluster-by-id.injectable";
import { DisconnectCluster, disconnectClusterInjectionToken } from "../../common/ipc/disconnect-cluster-injection-token";
import clusterFramesInjectable from "../clusters/frames.injectable";
import handleInjectable from "./handle.injectable";

const disconnectClusterInjectable = disconnectClusterInjectionToken.getInjectable((di, channel) => {
  const getClusterById = di.inject(getClusterByIdInjectable);
  const clusterFrames = di.inject(clusterFramesInjectable);
  const handle = di.inject(handleInjectable);
  const appEventBus = di.inject(appEventBusInjectable);

  const res: DisconnectCluster = async (id) => {
    appEventBus.emit({ name: "cluster", action: "stop" });
    const cluster = getClusterById(id);

    if (cluster) {
      cluster.disconnect();
      clusterFrames.delete(id);
    }
  };

  handle(channel, res);

  return res;
});

export default disconnectClusterInjectable;
