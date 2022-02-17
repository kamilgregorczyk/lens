/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { CreateResourceApplier } from "../../kube-resources/create-applier.injectable";
import createResourceApplierInjectable from "../../kube-resources/create-applier.injectable";
import type { LensApiRequest, RouteHandler } from "../../router";
import { respondJson, respondText } from "../../utils/http-responses";

interface Dependencies {
  createResourceApplier: CreateResourceApplier;
}

const applyResource = ({ createResourceApplier }: Dependencies): RouteHandler => (
  async (request: LensApiRequest) => {
    const { response, cluster, payload } = request;

    try {
      const resource = await createResourceApplier(cluster).apply(payload);

      respondJson(response, resource, 200);
    } catch (error) {
      respondText(response, error, 422);
    }
  }
);

const applyResourceRouteInjectable = getInjectable({
  instantiate: (di) => applyResource({
    createResourceApplier: di.inject(createResourceApplierInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default applyResourceRouteInjectable;
