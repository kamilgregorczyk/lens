/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { LensLogger } from "../logger";
import { baseLoggerInjectionToken } from "./base-logger.token";
import claimChildLoggerInjectable, { ClaimChildLogger } from "./claim-child-logger.injectable";

export type CreateChildLogger = (prefix: string, defaultMeta?: Record<string, any>) => LensLogger<typeof defaultMeta>;

interface Dependencies {
  baseLogger: LensLogger;
  claimChildLogger: ClaimChildLogger;
}

const createChildLogger = ({ baseLogger, claimChildLogger }: Dependencies): CreateChildLogger => (
  (prefix, defaultMeta) => {
    const doDebugLogging = claimChildLogger(prefix);

    const joinMeta = (meta: any): any => {
      if (defaultMeta) {
        return {
          ...defaultMeta,
          ...meta,
        };
      }

      return meta;
    };

    return {
      debug: (message, meta) => {
        if (doDebugLogging.get()) {
          baseLogger.debug(`[${prefix}]: ${message}`, joinMeta(meta));
        }
      },
      info: (message, meta) => void baseLogger.info(`[${prefix}]: ${message}`, joinMeta(meta)),
      error: (message, meta) => void baseLogger.error(`[${prefix}]: ${message}`, joinMeta(meta)),
      warn: (message, meta) => void baseLogger.warn(`[${prefix}]: ${message}`, joinMeta(meta)),
    };
  }
);

const createChildLoggerInjectable = getInjectable({
  instantiate: (di) => createChildLogger({
    baseLogger: di.inject(baseLoggerInjectionToken),
    claimChildLogger: di.inject(claimChildLoggerInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default createChildLoggerInjectable;
