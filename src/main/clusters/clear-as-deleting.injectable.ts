/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ClusterId } from "../../common/cluster-types";
import type { ClusterManager } from "./manager";
import clusterManagerInjectable from "./manager.injectable";

export type ClearAsDeleting = (clusterId: ClusterId) => void;

interface Dependencies {
  manager: ClusterManager;
}

const clearAsDeleting = ({ manager }: Dependencies): ClearAsDeleting => (
  (clusterId) => manager.clearAsDeleting(clusterId)
);

const clearAsDeletingInjectable = getInjectable({
  instantiate: (di) => clearAsDeleting({
    manager: di.inject(clusterManagerInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default clearAsDeletingInjectable;
