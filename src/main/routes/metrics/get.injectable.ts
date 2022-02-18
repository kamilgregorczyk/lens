/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { ClusterMetadataKey, ClusterPrometheusMetadata } from "../../../common/cluster-types";
import type { LensLogger } from "../../../common/logger";
import { entries } from "../../../common/utils";
import type { RouteHandler } from "../../router";
import { respondJson } from "../../utils/http-responses";
import loadMetricsInjectable, { LoadMetrics } from "./load-metrics.injectable";
import metricsRouteLoggerInjectable from "./logger.injectable";

interface Dependencies {
  loadMetrics: LoadMetrics;
  logger: LensLogger;
}

export type IMetricsQuery = string | string[] | {
  [metricName: string]: string;
};

const getMetrics = ({
  loadMetrics,
  logger,
}: Dependencies): RouteHandler => (
  async ({ response, cluster, payload, query }) => {
    const queryParams: IMetricsQuery = Object.fromEntries(query.entries());
    const prometheusMetadata: ClusterPrometheusMetadata = {};

    try {
      const { prometheusPath, provider } = await cluster.contextHandler.getPrometheusDetails();

      prometheusMetadata.provider = provider?.id;
      prometheusMetadata.autoDetected = !cluster.preferences.prometheusProvider?.type;

      if (!prometheusPath) {
        prometheusMetadata.success = false;

        return respondJson(response, {});
      }

      // return data in same structure as query
      if (typeof payload === "string") {
        const [data] = await loadMetrics([payload], cluster, prometheusPath, queryParams);

        respondJson(response, data);
      } else if (Array.isArray(payload)) {
        const data = await loadMetrics(payload, cluster, prometheusPath, queryParams);

        respondJson(response, data);
      } else if (typeof payload === "object" && payload) {
        const queries = entries(payload as Record<string, Record<string, string>>)
          .map(([queryName, queryOpts]) => (
            provider.getQuery(queryOpts, queryName)
          ));
        const result = await loadMetrics(queries, cluster, prometheusPath, queryParams);
        const data = Object.fromEntries(Object.keys(payload).map((metricName, i) => [metricName, result[i]]));

        respondJson(response, data);
      }
      prometheusMetadata.success = true;
    } catch (error) {
      prometheusMetadata.success = false;
      respondJson(response, {});
      logger.warn(`failed to get metrics for clusterId=${cluster.id}:`, error);
    } finally {
      cluster.metadata[ClusterMetadataKey.PROMETHEUS] = prometheusMetadata;
    }
  }
);

const getMetricsInjectable = getInjectable({
  instantiate: (di) => getMetrics({
    loadMetrics: di.inject(loadMetricsInjectable),
    logger: di.inject(metricsRouteLoggerInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getMetricsInjectable;
