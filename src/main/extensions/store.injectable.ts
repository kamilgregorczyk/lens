/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createExtensionsPreferencesStoreInjectable from "../../common/extensions/preferences/create-store.injectable";
import versionedMigrationsInjectable from "./migrations/versioned.injectable";

const extensionsPreferencesStoreInjectable = getInjectable({
  instantiate: (di) => {
    const createExtensionsPreferencesStore = di.inject(createExtensionsPreferencesStoreInjectable);

    return createExtensionsPreferencesStore({
      migrations: di.inject(versionedMigrationsInjectable),
    });
  },
  lifecycle: lifecycleEnum.singleton,
});

export default extensionsPreferencesStoreInjectable;
