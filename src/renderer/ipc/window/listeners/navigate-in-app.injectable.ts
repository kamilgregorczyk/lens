/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { emitNavigateInAppInjectionToken, NavigateInApp } from "../../../../common/ipc/window/navigate-in-app.token";
import type { LensLogger } from "../../../../common/logger";
import { baseLoggerInjectionToken } from "../../../../common/logger/base-logger.token";
import type { Navigate } from "../../../navigation/navigate.injectable";
import navigateInjectable from "../../../navigation/navigate.injectable";
import { setupListener } from "../../setup-listener";

interface Dependencies {
  logger: LensLogger;
  navigate: Navigate;
}

const listener = ({ logger, navigate }: Dependencies): NavigateInApp => (
  (url) => {
    logger.info(`navigate to ${url} from ${location.href}`);
    navigate(url);
    window.focus(); // make sure that the main frame is focused
  }
);

const initNavigateInAppListenerInjectable = getInjectable({
  instantiate: (di) => () => {
    setupListener(di, emitNavigateInAppInjectionToken, listener({
      logger: di.inject(baseLoggerInjectionToken),
      navigate: di.inject(navigateInjectable),
    }));
  },
  lifecycle: lifecycleEnum.singleton,
});

export default initNavigateInAppListenerInjectable;
