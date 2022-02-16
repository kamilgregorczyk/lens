/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createHotbarStoreInjectable from "../../common/hotbars/create-store.injectable";
import { hotbarStoreInjectionToken } from "../../common/hotbars/store-injection-token";
import syncGeneralEntitiesInjectable from "../catalog/local-sources/general/sync-entities.injectable";
import syncWeblinkEntitiesInjectable from "../catalog/local-sources/weblinks/sync-entities.injectable";
import versionedMigrationsInjectable from "./migrations/versioned.injectable";

const hotbarStoreInjectable = getInjectable({
  setup: (di) => {
    const syncGeneralEntities = di.inject(syncGeneralEntitiesInjectable);
    const syncWeblinkEntities = di.inject(syncWeblinkEntitiesInjectable);

    syncGeneralEntities();
    syncWeblinkEntities();
  },
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
