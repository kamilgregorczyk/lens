/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { kubeJsonApiForClusterInjectionToken } from "../../common/k8s-api/kube-json-api-for-cluster.token";
import { apiKubePrefix, isDebugging } from "../../common/vars";
import { KubeJsonApi } from "../../extensions/renderer-api/k8s-api";

const kubeJsonApiForClusterInjectable = getInjectable({
  instantiate: () => (clusterId) => new KubeJsonApi({
    serverAddress: `http://127.0.0.1:${window.location.port}`,
    apiBase: apiKubePrefix,
    debug: isDebugging,
  }, {
    headers: {
      "Host": `${clusterId}.localhost:${window.location.port}`,
    },
  }),
  injectionToken: kubeJsonApiForClusterInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default kubeJsonApiForClusterInjectable;
