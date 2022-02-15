/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { asLegacyGlobalObjectForExtensionApi } from "../extensions/di-legacy-globals/as-legacy-global-object-for-extension-api";
import { baseLoggerInjectionToken } from "./logger/base-logger.token";

export interface LensLogger<T = any> {
  error: (message: string, meta?: T extends object ? T : any) => void;
  info: (message: string, meta?: T extends object ? T : any) => void;
  debug: (message: string, meta?: T extends object ? T : any) => void;
  warn: (message: string, meta?: T extends object ? T : any) => void;
}

/**
 * @deprecated use either di.inject(baseLoggerInjectableToken) or di.inject(createChildLoggerInjectable)
 */
const logger = asLegacyGlobalObjectForExtensionApi(baseLoggerInjectionToken);

export default logger;
