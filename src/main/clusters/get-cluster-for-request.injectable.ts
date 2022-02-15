/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { IncomingMessage } from "http";
import type { Cluster } from "../../common/cluster/cluster";
import type { ClusterManager } from "./manager";
import clusterManagerInjectable from "./manager.injectable";

export type GetClusterForRequest = (req: IncomingMessage) => Cluster | undefined;

interface Dependencies {
  manager: ClusterManager;
}

const getClusterForRequest = ({ manager }: Dependencies): GetClusterForRequest => (
  (req) => manager.getClusterForRequest(req)
);

const getClusterForRequestInjectable = getInjectable({
  instantiate: (di) => getClusterForRequest({
    manager: di.inject(clusterManagerInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getClusterForRequestInjectable;
