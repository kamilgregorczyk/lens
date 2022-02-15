/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { CatalogEntity } from "../../../common/catalog/entity/entity";
import type { CatalogEntityRegistry } from "./registry";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import catalogEntityRegistryInjectable from "./registry.injectable";

export type EntityOnRun = (entity: CatalogEntity) => void;

interface Dependencies {
  registry: CatalogEntityRegistry;
}

const entityOnRun = ({ registry }: Dependencies): EntityOnRun => (
  (entity) => registry.onRun(entity)
);

const entityOnRunInjectable = getInjectable({
  instantiate: (di) => entityOnRun({
    registry: di.inject(catalogEntityRegistryInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default entityOnRunInjectable;

