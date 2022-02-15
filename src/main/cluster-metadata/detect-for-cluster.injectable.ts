/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { ClusterMetadata } from "../../common/cluster-types";
import type { Cluster } from "../../common/cluster/cluster";
import type { DetectorRegistry } from "./detector-registry";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import clusterMetadataDetectorRegistryInjectable from "./detector-registry.injectable";

export type DetectMetadataForCluster = (cluster: Cluster) => Promise<ClusterMetadata>;

interface Dependencies {
  registry: DetectorRegistry;
}

const detectMetadataForCluster = ({ registry }: Dependencies): DetectMetadataForCluster => (
  (cluster) => registry.detectForCluster(cluster)
);

const detectMetadataForClusterInjectable = getInjectable({
  instantiate: (di) => detectMetadataForCluster({
    registry: di.inject(clusterMetadataDetectorRegistryInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default detectMetadataForClusterInjectable;

