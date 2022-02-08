/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import directoryForUserDataInjectable from "../../common/app-paths/directory-for-user-data.injectable";
import { UserStore } from "../../common/user-store/user-store";
import { userStoreInjectionToken } from "../../common/user-store/user-store-injection-token";
import fileNameMigrationInjectable from "./migrations/file-name-migration.injectable";
import versionedMigrationsInjectable from "./migrations/versioned.injectable";

const userStoreInjectableInjectable = getInjectable({
  setup: async (di) => {
    const fileNameMigration = di.inject(fileNameMigrationInjectable);

    await fileNameMigration();
  },
  instantiate: (di) => new UserStore(
    {
      userDataPath: di.inject(directoryForUserDataInjectable),
    },
    {
      migrations: di.inject(versionedMigrationsInjectable),
    },
  ),
  injectionToken: userStoreInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default userStoreInjectableInjectable;
