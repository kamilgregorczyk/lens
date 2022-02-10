/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createUserStoreInjectable from "../../common/user-preferences/create-store.injectable";
import { userStoreInjectionToken } from "../../common/user-preferences/store-injection-token";
import fileNameMigrationInjectable from "./migrations/file-name-migration.injectable";
import versionedMigrationsInjectable from "./migrations/versioned.injectable";

const userStoreInjectableInjectable = getInjectable({
  setup: async (di) => {
    const fileNameMigration = di.inject(fileNameMigrationInjectable);

    await fileNameMigration();
  },
  instantiate: (di) => {
    const createUserStore = di.inject(createUserStoreInjectable);

    return createUserStore({
      migrations: di.inject(versionedMigrationsInjectable),
    });
  },
  injectionToken: userStoreInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default userStoreInjectableInjectable;
