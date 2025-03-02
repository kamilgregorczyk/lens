/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import allowedResourcesInjectable from "../cluster-store/allowed-resources.injectable";
import type { KubeResource } from "../rbac";

export type IsAllowedResource = (resource: KubeResource) => boolean;

// TODO: This injectable obscures MobX de-referencing. Make it more apparent in usage.
const isAllowedResourceInjectable = getInjectable({
  instantiate: (di) => {
    const allowedResources = di.inject(allowedResourcesInjectable);

    return (resource: KubeResource) => allowedResources.get().has(resource);
  },

  lifecycle: lifecycleEnum.singleton,
});

export default isAllowedResourceInjectable;
