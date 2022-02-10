/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { LensLogger } from "../logger";
import baseLoggerInjectable from "./base-logger.injectable";
import claimChildLoggerInjectable from "./claim-child-logger.injectable";

const createChildLoggerInjectable = getInjectable({
  instantiate: (di) => {
    const baseLogger = di.inject(baseLoggerInjectable);
    const claimChildLogger = di.inject(claimChildLoggerInjectable);

    return (prefix: string): LensLogger => {
      const doDebugLogging = claimChildLogger(prefix);

      return {
        debug: (message, meta) => {
          if (doDebugLogging.get()) {
            baseLogger.debug(`[${prefix}]: ${message}`, meta);
          }
        },
        info: (message, meta) => void baseLogger.info(`[${prefix}]: ${message}`, meta),
        error: (message, meta) => void baseLogger.error(`[${prefix}]: ${message}`, meta),
        warn: (message, meta) => void baseLogger.warn(`[${prefix}]: ${message}`, meta),
      };
    };
  },
  lifecycle: lifecycleEnum.singleton,
});

export default createChildLoggerInjectable;
