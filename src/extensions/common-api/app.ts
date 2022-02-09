/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getAppVersion } from "../../common/utils";
import { asLegacyGlobalFunctionForExtensionApi } from "../di-legacy-globals/as-legacy-global-function-for-extension-api";
import getEnabledExtensionsInjectable from "../../common/extensions/get-enabled-extensions.injectable";
import * as Preferences from "./user-preferences";

export const version = getAppVersion();
export { isSnap, isWindows, isMac, isLinux, appName, slackUrl, issuesTrackerUrl } from "../../common/vars";

export const getEnabledExtensions = asLegacyGlobalFunctionForExtensionApi(getEnabledExtensionsInjectable);

export { Preferences };
