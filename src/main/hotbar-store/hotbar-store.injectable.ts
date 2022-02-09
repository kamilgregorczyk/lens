/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createHotbarStoreInjectable from "../../common/hotbar-store/create-hotbar-store.injectable";
import { hotbarStoreInjectionToken } from "../../common/hotbar-store/hotbar-store-injection-token";
import versionedMigrationsInjectable from "./migrations/versioned.injectable";

const hotbarStoreInjectable = getInjectable({
  instantiate: (di) => {
    const createHotbarStore = di.inject(createHotbarStoreInjectable);

    return createHotbarStore({
      migrations: di.inject(versionedMigrationsInjectable),
    });
  },
  injectionToken: hotbarStoreInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default hotbarStoreInjectable;
