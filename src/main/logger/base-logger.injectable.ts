/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { baseLoggerInjectionToken } from "../../common/logger/base-logger.token";
import { isDebugging, isTestEnv } from "../../common/vars";
import winston, { format } from "winston";
import { consoleFormat } from "winston-console-format";
import appPathsInjectable from "../electron/app-paths.injectable";
import type { LensLogger } from "../../common/logger";

const baseLoggerInjectable = getInjectable({
  instantiate: (di) => {
    const appPaths = di.inject(appPathsInjectable);
    const logLevel = process.env.LOG_LEVEL ?? (
      isDebugging
        ? "debug"
        : isTestEnv
          ? "error"
          : "info"
    );

    return winston.createLogger({
      format: format.simple(),
      transports: [
        new winston.transports.Console({
          handleExceptions: false,
          level: logLevel,
          format: format.combine(
            format.colorize({ level: true, message: false }),
            format.padLevels(),
            format.ms(),
            consoleFormat({
              showMeta: true,
              inspectOptions: {
                depth: 4,
                colors: true,
                maxArrayLength: 10,
                breakLength: 120,
                compact: Infinity,
              },
            }),
          ),
        }),
        new winston.transports.File({
          handleExceptions: false,
          level: logLevel,
          filename: "lens.log",
          dirname: appPaths["logs"],
          maxsize: 16 * 1024,
          maxFiles: 16,
          tailable: true,
        }),
      ],
    }) as LensLogger;
  },
  injectionToken: baseLoggerInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default baseLoggerInjectable;
