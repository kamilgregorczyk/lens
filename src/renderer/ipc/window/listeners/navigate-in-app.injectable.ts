/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { emitNavigateInAppInjectionToken, NavigateInApp } from "../../../../common/ipc/window/navigate-in-app.token";
import type { LensLogger } from "../../../../common/logger";
import baseLoggerInjectable from "../../../../common/logger/base-logger.injectable";
import { navigate } from "../../../navigation";
import { setupListener } from "../../setup-listener";

interface Dependencies {
  logger: LensLogger;
}

const listener = ({ logger }: Dependencies): NavigateInApp => (
  (url) => {
    logger.info(`navigate to ${url} from ${location.href}`);
    navigate(url);
    window.focus(); // make sure that the main frame is focused
  }
);

const initNavigateInAppListenerInjectable = getInjectable({
  instantiate: (di) => () => {
    setupListener(di, emitNavigateInAppInjectionToken, listener({
      logger: di.inject(baseLoggerInjectable),
    }));
  },
  lifecycle: lifecycleEnum.singleton,
});

export default initNavigateInAppListenerInjectable;
