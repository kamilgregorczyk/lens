/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ClusterMetricsResourceType } from "../../common/cluster-types";
import type { Cluster } from "../../common/clusters/cluster";
import hostedClusterInjectable from "./hosted-cluster.injectable";

export type ShouldDisplayMetric = (type: ClusterMetricsResourceType) => boolean;

interface Dependencies {
  cluster: Cluster;
}

const shouldDisplayMetric = ({ cluster }: Dependencies): ShouldDisplayMetric => (
  (type) => !cluster.isMetricHidden(type)
);

const shouldDisplayMetricInjectable = getInjectable({
  instantiate: (di) => shouldDisplayMetric({
    cluster: di.inject(hostedClusterInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default shouldDisplayMetricInjectable;
