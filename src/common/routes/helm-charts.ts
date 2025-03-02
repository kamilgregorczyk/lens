/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { RouteProps } from "react-router";
import { buildURL } from "../utils/buildUrl";
import { helmRoute } from "./helm";

export const helmChartsRoute: RouteProps = {
  path: `${helmRoute.path}/charts/:repo?/:chartName?`,
};

export interface HelmChartsRouteParams {
  chartName?: string;
  repo?: string;
}

export const helmChartsURL = buildURL<HelmChartsRouteParams>(helmChartsRoute.path);
