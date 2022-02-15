/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { CatalogEntityRun, emitCatalogEntityRunInjectionToken } from "../../../../common/ipc/catalog-entity/run/emit.token";
import type { CatalogEntityRegistry } from "../../../catalog/entity/registry";
import catalogEntityRegistryInjectable from "../../../catalog/entity/registry.injectable";
import { setupListener } from "../../setup-listener";

interface Dependencies {
  entityRegistry: CatalogEntityRegistry;
}

const listener = ({ entityRegistry }: Dependencies): CatalogEntityRun => (
  (entityId) => {
    const entity = entityRegistry.getById(entityId);

    if (entity) {
      entityRegistry.onRun(entity);
    }
  }
);

const initCatalogEntityRunListenerInjectable = getInjectable({
  instantiate: (di) => () => {
    setupListener(di, emitCatalogEntityRunInjectionToken, listener({
      entityRegistry: di.inject(catalogEntityRegistryInjectable),
    }));
  },
  lifecycle: lifecycleEnum.singleton,
});

export default initCatalogEntityRunListenerInjectable;
