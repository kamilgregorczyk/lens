/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { apiPrefix } from "../../common/vars";
import { Router } from "../router";
import { VersionRoute, KubeconfigRoute, MetricsRoute, PortForwardRoute, HelmApiRoute } from "../routes";
import routePortForwardInjectable from "../routes/port-forward/route-port-forward.injectable";
import applyResourceRouteInjectable from "../routes/resource-applier/apply.injectable";
import patchResourceRouteInjectable from "../routes/resource-applier/patch.injectable";

const routerInjectable = getInjectable({
  instantiate: (di) => new Router([
    {
      method: "post",
      path: `${apiPrefix}/pods/port-forward/{namespace}/{resourceType}/{resourceName}`,
      handler: di.inject(routePortForwardInjectable),
    },
    {
      method: "post",
      path: `${apiPrefix}/stack`,
      handler: di.inject(applyResourceRouteInjectable),
    },
    {
      method: "patch",
      path: `${apiPrefix}/stack`,
      handler: di.inject(patchResourceRouteInjectable),
    },
    { method: "get", path: "/version", handler: VersionRoute.getVersion },
    { method: "get", path: `${apiPrefix}/kubeconfig/service-account/{namespace}/{account}`, handler: KubeconfigRoute.routeServiceAccountRoute },
    { method: "post", path: `${apiPrefix}/metrics`, handler: MetricsRoute.routeMetrics },
    { method: "get", path: `${apiPrefix}/metrics/providers`, handler: MetricsRoute.routeMetricsProviders },
    { method: "get", path: `${apiPrefix}/pods/port-forward/{namespace}/{resourceType}/{resourceName}`, handler: PortForwardRoute.routeCurrentPortForward },
    { method: "delete", path: `${apiPrefix}/pods/port-forward/{namespace}/{resourceType}/{resourceName}`, handler: PortForwardRoute.routeCurrentPortForwardStop },
    { method: "get", path: `${apiPrefix}/v2/charts`, handler: HelmApiRoute.listCharts },
    { method: "get", path: `${apiPrefix}/v2/charts/{repo}/{chart}`, handler: HelmApiRoute.getChart },
    { method: "get", path: `${apiPrefix}/v2/charts/{repo}/{chart}/values`, handler: HelmApiRoute.getChartValues },
    { method: "post", path: `${apiPrefix}/v2/releases`, handler: HelmApiRoute.installChart },
    { method: `put`, path: `${apiPrefix}/v2/releases/{namespace}/{release}`, handler: HelmApiRoute.updateRelease },
    { method: `put`, path: `${apiPrefix}/v2/releases/{namespace}/{release}/rollback`, handler: HelmApiRoute.rollbackRelease },
    { method: "get", path: `${apiPrefix}/v2/releases/{namespace?}`, handler: HelmApiRoute.listReleases },
    { method: "get", path: `${apiPrefix}/v2/releases/{namespace}/{release}`, handler: HelmApiRoute.getRelease },
    { method: "get", path: `${apiPrefix}/v2/releases/{namespace}/{release}/values`, handler: HelmApiRoute.getReleaseValues },
    { method: "get", path: `${apiPrefix}/v2/releases/{namespace}/{release}/history`, handler: HelmApiRoute.getReleaseHistory },
    { method: "delete", path: `${apiPrefix}/v2/releases/{namespace}/{release}`, handler: HelmApiRoute.deleteRelease },
  ]),

  lifecycle: lifecycleEnum.singleton,
});

export default routerInjectable;
