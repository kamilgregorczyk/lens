/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { apiPrefix } from "../../../common/vars";
import type { LensApiRequest, LensApiResult } from "../../router";
import { routeInjectionToken } from "../../router/router.injectable";
import { PrometheusProviderRegistry } from "../../prometheus";
import type { MetricProviderInfo } from "../../../common/k8s-api/endpoints/metrics.api";

const getMetricProvidersRouteInjectable = getInjectable({
  id: "get-metric-providers-route",

  instantiate: () => ({
    method: "get",
    path: `${apiPrefix}/metrics/providers`,

    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    handler: async (request: LensApiRequest) : Promise<LensApiResult> => {
      const providers: MetricProviderInfo[] = [];

      for (const { name, id, isConfigurable } of PrometheusProviderRegistry.getInstance().providers.values()) {
        providers.push({ name, id, isConfigurable });
      }

      return { response: providers };
    },
  }),

  injectionToken: routeInjectionToken,
});

export default getMetricProvidersRouteInjectable;
