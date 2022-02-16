/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import kubectlBinariesPathInjectable from "../../common/user-preferences/kubectl-download-path.injectable";
import { asLegacyGlobalObjectForExtensionApi } from "../di-legacy-globals/as-legacy-global-object-for-extension-api";

const kubectlBinariesPath = asLegacyGlobalObjectForExtensionApi(kubectlBinariesPathInjectable);

/**
 * Get the configured kubectl binaries path.
 */
export function getKubectlPath(): string | undefined {
  return kubectlBinariesPath.get();
}
