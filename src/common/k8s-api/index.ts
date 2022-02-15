/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { asLegacyGlobalObjectForExtensionApi } from "../../extensions/di-legacy-globals/as-legacy-global-object-for-extension-api";
import { apiBaseInjectionToken } from "./api-base.token";
import { apiKubeInjectionToken } from "./api-kube.token";

/**
 * @deprecated use di.inject(apiBaseInjectionToken) instead
 */
export const apiBase = asLegacyGlobalObjectForExtensionApi(apiBaseInjectionToken);

/**
 * @deprecated use di.inject(apiKubeInjectionToken) instead
 */
export const apiKube = asLegacyGlobalObjectForExtensionApi(apiKubeInjectionToken);
