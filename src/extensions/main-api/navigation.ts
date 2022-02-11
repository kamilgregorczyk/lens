/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import navigateInAppInjectable from "../../main/ipc/window/navigate-in-app.injectable";
import { asLegacyGlobalFunctionForExtensionApi } from "../di-legacy-globals/as-legacy-global-function-for-extension-api";

export const navigate = asLegacyGlobalFunctionForExtensionApi(navigateInAppInjectable);
