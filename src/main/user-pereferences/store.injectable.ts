/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { reaction } from "mobx";
import appEventBusInjectable from "../../common/app-event-bus/app-event-bus.injectable";
import createUserStoreInjectable from "../../common/user-preferences/create-store.injectable";
import { userPreferencesStoreInjectionToken } from "../../common/user-preferences/store-injection-token";
import fileNameMigrationInjectable from "./migrations/file-name-migration.injectable";
import versionedMigrationsInjectable from "./migrations/versioned.injectable";
import setLoginItemSettingsInjectable from "../electron/set-login-item-settings.injectable";

const userPreferencesStoreInjectableInjectable = getInjectable({
  setup: async (di) => {
    const fileNameMigration = di.inject(fileNameMigrationInjectable);

    await fileNameMigration();
  },
  instantiate: (di) => {
    const createUserStore = di.inject(createUserStoreInjectable);
    const store = createUserStore({
      migrations: di.inject(versionedMigrationsInjectable),
    });
    const appEventBus = di.inject(appEventBusInjectable);
    const setLoginItemSettings = di.inject(setLoginItemSettingsInjectable);

    // track telemetry availability
    reaction(() => store.allowTelemetry, allowed => {
      appEventBus.emit({ name: "telemetry", action: allowed ? "enabled" : "disabled" });
    });

    // open at system start-up
    reaction(() => store.openAtLogin, openAtLogin => {
      setLoginItemSettings({
        openAtLogin,
        openAsHidden: true,
        args: ["--hidden"],
      });
    }, {
      fireImmediately: true,
    });

    return store;
  },
  injectionToken: userPreferencesStoreInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default userPreferencesStoreInjectableInjectable;
