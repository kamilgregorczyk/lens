/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { apiPrefix } from "../../../../common/vars";
import type { LensApiRequest, LensApiResult } from "../../../router";
import { helmService } from "../../../helm/helm-service";
import { routeInjectionToken } from "../../../router/router.injectable";
import { getInjectable } from "@ogre-tools/injectable";

const listReleasesRouteInjectable = getInjectable({
  id: "list-releases-route",

  instantiate: () => ({
    method: "get",
    path: `${apiPrefix}/v2/releases/{namespace?}`,

    handler: async (request: LensApiRequest): Promise<LensApiResult> => {
      const { cluster, params } = request;

      return {
        response: await helmService.listReleases(cluster, params.namespace),
      };
    },
  }),

  injectionToken: routeInjectionToken,
});

export default listReleasesRouteInjectable;
