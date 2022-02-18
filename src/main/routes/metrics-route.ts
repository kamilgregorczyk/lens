/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { LensApiRequest } from "../router";
import { respondJson } from "../utils/http-responses";
import { PrometheusProviderRegistry } from "../prometheus";

export interface MetricProviderInfo {
  name: string;
  id: string;
  isConfigurable: boolean;
}

export class MetricsRoute {
  static async routeMetricsProviders({ response }: LensApiRequest) {
    const providers: MetricProviderInfo[] = [];

    for (const { name, id, isConfigurable } of PrometheusProviderRegistry.getInstance().providers.values()) {
      providers.push({ name, id, isConfigurable });
    }

    respondJson(response, providers);
  }
}
