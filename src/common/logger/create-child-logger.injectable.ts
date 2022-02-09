/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { LensLogger } from "../logger";
import baseLoggerInjectable from "./base-logger.injectable";

const createChildLoggerInjectable = getInjectable({
  instantiate: (di) => {
    const baseLogger = di.inject(baseLoggerInjectable); // TODO: make injectable

    return (prefix: string): LensLogger => ({
      debug: (message, meta) => baseLogger.debug(`[${prefix}]: ${message}`, meta),
      info: (message, meta) => baseLogger.info(`[${prefix}]: ${message}`, meta),
      error: (message, meta) => baseLogger.error(`[${prefix}]: ${message}`, meta),
      warn: (message, meta) => baseLogger.warn(`[${prefix}]: ${message}`, meta),
    });
  },
  lifecycle: lifecycleEnum.singleton,
});

export default createChildLoggerInjectable;
