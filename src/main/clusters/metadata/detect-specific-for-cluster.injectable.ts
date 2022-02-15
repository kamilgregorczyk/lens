/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { Cluster } from "../../../common/clusters/cluster";
import type { ClusterDetectionResult } from "./cluster-detector";
import type { DetectorRegistry } from "./detector-registry";
import clusterMetadataDetectorRegistryInjectable from "./detector-registry.injectable";

export type DetectSpecificForCluster = (cluster: Cluster, key: string) => Promise<ClusterDetectionResult>;

interface Dependencies {
  registry: DetectorRegistry;
}

const detectSpecificForCluster = ({ registry }: Dependencies): DetectSpecificForCluster => (
  (cluster, key) => registry.detectSpecificForCluster(cluster, key)
);

const detectSpecificMetadataForClusterInjectable = getInjectable({
  instantiate: (di) => detectSpecificForCluster({
    registry: di.inject(clusterMetadataDetectorRegistryInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default detectSpecificMetadataForClusterInjectable;
