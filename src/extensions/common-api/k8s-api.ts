/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

// This is the common k8s API between main and renderer. Currently it is exported there

import { KubeJsonApi as _KubeJsonApi } from "../../common/k8s-api/kube-json-api";
import { kubeJsonApiForClusterInjectionToken } from "../../common/k8s-api/kube-json-api-for-cluster.token";
import { asLegacyGlobalFunctionForExtensionApi } from "../di-legacy-globals/as-legacy-global-function-for-extension-api";

export const KubeJsonApi = Object.assign(_KubeJsonApi, {
  forCluster: asLegacyGlobalFunctionForExtensionApi(kubeJsonApiForClusterInjectionToken),
});
