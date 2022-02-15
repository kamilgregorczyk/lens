/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { matchPath, RouteProps } from "react-router";
import { navigation } from "./history";
import { ClusterViewRouteParams, clusterViewRoute } from "../../common/routes";
import { PageParam, PageParamInit } from "./page-param";
import { asLegacyGlobalFunctionForExtensionApi } from "../../extensions/di-legacy-globals/as-legacy-global-function-for-extension-api";
import navigateInjectable from "./navigate.injectable";

/**
 * @deprecated use di.inject(navigateInjectable) instead
 */
export const navigate = asLegacyGlobalFunctionForExtensionApi(navigateInjectable);

export function navigateWithoutHistoryChange(location: Partial<Location>) {
  navigation.merge(location, true);
}

export function createPageParam<V = string>(init: PageParamInit<V>) {
  return new PageParam<V>(init, navigation);
}

export function matchRoute<P>(route: string | string[] | RouteProps) {
  return matchPath<P>(navigation.location.pathname, route);
}

export function isActiveRoute(route: string | string[] | RouteProps): boolean {
  return !!matchRoute(route);
}

export function getMatchedClusterId(): string | undefined {
  const matched = matchPath<ClusterViewRouteParams>(navigation.location.pathname, {
    exact: true,
    path: clusterViewRoute.path,
  });

  return matched?.params.clusterId;
}
