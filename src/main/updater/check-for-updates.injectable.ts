/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import emitCheckingForUpdatesInjectable from "../../common/ipc/updates/checking/emit.injectable";
import type { LensLogger } from "../../common/logger";
import type { UserPreferencesStore } from "../../common/user-preferences/store";
import { userPreferencesStoreInjectionToken } from "../../common/user-preferences/store-injection-token";
import updaterLoggerInjectable from "./logger.injectable";
import type { AppUpdater } from "electron-updater";
import electronUpdaterInjectable from "./electron-updater.injectable";

interface Dependencies {
  store: UserPreferencesStore;
  emitCheckingForUpdates: () => void;
  logger: LensLogger;
  autoUpdater: AppUpdater;
}

export type CheckForUpdates = () => Promise<void>;

const checkForUpdates = ({ store, emitCheckingForUpdates, logger, autoUpdater }: Dependencies) => (
  async () => {
    logger.info(`📡 Checking for app updates`);
    autoUpdater.channel = store.updateChannel;
    autoUpdater.allowDowngrade = store.isAllowedToDowngrade;
    emitCheckingForUpdates();

    try {
      await autoUpdater.checkForUpdates();
    } catch (error) {
      logger.error("Check for updates failed", error);
    }
  }
);

const checkForUpdatesInjectable = getInjectable({
  instantiate: (di) => checkForUpdates({
    store: di.inject(userPreferencesStoreInjectionToken),
    emitCheckingForUpdates: di.inject(emitCheckingForUpdatesInjectable),
    logger: di.inject(updaterLoggerInjectable),
    autoUpdater: di.inject(electronUpdaterInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default checkForUpdatesInjectable;
