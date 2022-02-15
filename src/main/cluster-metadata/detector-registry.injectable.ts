/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { ClusterMetadataKey } from "../../common/cluster-types";
import k8sRequestInjectable from "../k8s-api/request.injectable";
import { clusterIdDetector } from "./cluster-id-detector";
import { DetectorRegistry } from "./detector-registry";
import { distributionDetector } from "./distribution-detector";
import { lastSeenDetector } from "./last-seen-detector";
import { nodesCountDetector } from "./nodes-count-detector";
import { versionDetector } from "./version-detector";

const clusterMetadataDetectorRegistryInjectable = getInjectable({
  instantiate: (di) => {
    const res = new DetectorRegistry({
      k8sRequest: di.inject(k8sRequestInjectable),
    });

    res.add(ClusterMetadataKey.CLUSTER_ID, clusterIdDetector);
    res.add(ClusterMetadataKey.LAST_SEEN, lastSeenDetector);
    res.add(ClusterMetadataKey.VERSION, versionDetector);
    res.add(ClusterMetadataKey.DISTRIBUTION, distributionDetector);
    res.add(ClusterMetadataKey.NODES_COUNT, nodesCountDetector);

    return res;
  },
  lifecycle: lifecycleEnum.singleton,
});

export default clusterMetadataDetectorRegistryInjectable;
