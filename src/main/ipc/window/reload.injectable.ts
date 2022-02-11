/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { emitWindowReloadPageInjectionToken } from "../../../common/ipc/window/reload-page.token";
import baseLoggerInjectable from "../../../common/logger/base-logger.injectable";
import clusterFramesInjectable from "../../clusters/frames.injectable";
import activeClusterIdInjectable from "../../window/active-cluster-id.injectable";
import windowManagerInjectable from "../../window/manager.injectable";

const reloadInjectable = getInjectable({
  instantiate: (di) => {
    const windowManager = di.inject(windowManagerInjectable);
    const clusterFrames = di.inject(clusterFramesInjectable);
    const activeClusterId = di.inject(activeClusterIdInjectable);
    const logger = di.inject(baseLoggerInjectable);

    return () => {
      windowManager.ensureMainWindow()
        .then(window => {
          const clusterId = activeClusterId.get();

          if (!clusterId) {
            window.webContents.reload();
            window.webContents.clearHistory();

            return;
          }

          const frameInfo = clusterFrames.get(clusterId);

          if (!frameInfo) {
            return void logger.warn(`No frameInfo for clusterId=${clusterId}`);
          }

          window.webContents.sendToFrame(
            [frameInfo.processId, frameInfo.frameId],
            emitWindowReloadPageInjectionToken.channel,
          );
        })
        .catch(error => logger.warn("Failed to ensure main window", error));
    };
  },
  injectionToken: emitWindowReloadPageInjectionToken.token,
  lifecycle: lifecycleEnum.singleton,
});

export default reloadInjectable;
