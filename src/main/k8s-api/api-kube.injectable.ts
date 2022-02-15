/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { apiKubeInjectionToken } from "../../common/k8s-api/api-kube.token";

const apiKubeInjectable = getInjectable({
  instantiate: () => undefined,
  injectionToken: apiKubeInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default apiKubeInjectable;
