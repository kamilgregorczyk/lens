/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { emitNavigateExtensionInjectionToken, NavigateExtension } from "../../../../common/ipc/window/navigate-extension.token";
import type { LensLogger } from "../../../../common/logger";
import { baseLoggerInjectionToken } from "../../../../common/logger/base-logger.token";
import type { LensRendererExtension } from "../../../../extensions/lens-renderer-extension";
import getExtensionByIdInjectable from "../../../extensions/get-by-id.injectable";
import { setupListener } from "../../setup-listener";

interface Dependencies {
  logger: LensLogger;
  getExtensionById: (extId: string) => LensRendererExtension | undefined;
}

const listener = ({ logger, getExtensionById }: Dependencies): NavigateExtension => (
  (extId, pageId, params) => {
    const extension = getExtensionById(extId);

    if (extension) {
      logger.info(`navigate to extensionId=${extId}`, { pageId, params });
      extension.navigate(pageId, params);
    } else {
      logger.warn(`tried to navigate to extensionId=${extId}, not found`);
    }
  }
);

const navigateExtensionListenerInjectable = getInjectable({
  setup: (di) => {
    setupListener(di, emitNavigateExtensionInjectionToken, listener({
      logger: di.inject(baseLoggerInjectionToken),
      getExtensionById: di.inject(getExtensionByIdInjectable),
    }));
  },
  instantiate: () => undefined,
  lifecycle: lifecycleEnum.singleton,
});

export default navigateExtensionListenerInjectable;
