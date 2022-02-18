/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getAppVersion } from "../../common/utils";
import { asLegacyGlobalFunctionForExtensionApi } from "../di-legacy-globals/as-legacy-global-function-for-extension-api";
import getEnabledExtensionsInjectable from "../../common/extensions/preferences/get-enabled.injectable";
import * as Preferences from "./user-preferences";
import { asLegacyGlobalObjectForExtensionApi } from "../di-legacy-globals/as-legacy-global-object-for-extension-api";
import isSnapInjectable from "../../common/vars/is-snap.injectable";
import { appName, slackUrl, issuesTrackerUrl } from "../../common/vars";
import isLinuxInjectable from "../../common/vars/is-linux.injectable";
import isMacInjectable from "../../common/vars/is-mac.injectable";
import isWindowsInjectable from "../../common/vars/is-windows.injectable";

export const version = getAppVersion();
export const isSnap = asLegacyGlobalObjectForExtensionApi(isSnapInjectable);
export const isWindows = asLegacyGlobalObjectForExtensionApi(isWindowsInjectable);
export const isMac = asLegacyGlobalObjectForExtensionApi(isMacInjectable);
export const isLinux = asLegacyGlobalObjectForExtensionApi(isLinuxInjectable);

export const getEnabledExtensions = asLegacyGlobalFunctionForExtensionApi(getEnabledExtensionsInjectable);

export { Preferences, appName, slackUrl, issuesTrackerUrl };
