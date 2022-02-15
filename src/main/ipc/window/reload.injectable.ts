/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { IObservableValue } from "mobx";
import type { ClusterId } from "../../../common/cluster-types";
import { emitWindowReloadPageInjectionToken, ReloadPage } from "../../../common/ipc/window/reload-page.token";
import type { LensLogger } from "../../../common/logger";
import { baseLoggerInjectionToken } from "../../../common/logger/base-logger.token";
import clusterFramesInjectable, { ClusterFrames } from "../../clusters/frames.injectable";
import activeClusterIdInjectable from "../../window/active-cluster-id.injectable";
import type { WindowManager } from "../../window/manager";
import windowManagerInjectable from "../../window/manager.injectable";

interface Dependencies {
  windowManager: WindowManager;
  clusterFrames: ClusterFrames;
  activeClusterId: IObservableValue<ClusterId | undefined>;
  logger: LensLogger;
}

const reload = ({ activeClusterId, clusterFrames, logger, windowManager }: Dependencies): ReloadPage => (
  () => {
    (async (): Promise<void> => {
      try {
        const window = await windowManager.ensureMainWindow();

        const clusterId = activeClusterId.get();

        if (!clusterId) {
          window.webContents.reload();
          window.webContents.clearHistory();

          return;
        }

        const frameInfo = clusterFrames.get(clusterId);

        if (!frameInfo) {
          return logger.warn(`No frameInfo for clusterId=${clusterId}`);
        }

        window.webContents.sendToFrame(
          [frameInfo.processId, frameInfo.frameId],
          emitWindowReloadPageInjectionToken.channel,
        );
      } catch (error) {
        logger.warn("Failed to ensure main window", error);
      }
    })();
  }
);

const reloadInjectable = getInjectable({
  instantiate: (di) => reload({
    windowManager: di.inject(windowManagerInjectable),
    clusterFrames: di.inject(clusterFramesInjectable),
    activeClusterId: di.inject(activeClusterIdInjectable),
    logger: di.inject(baseLoggerInjectionToken),
  }),
  injectionToken: emitWindowReloadPageInjectionToken.token,
  lifecycle: lifecycleEnum.singleton,
});

export default reloadInjectable;
