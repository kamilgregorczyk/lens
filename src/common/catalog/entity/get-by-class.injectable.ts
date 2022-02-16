/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { CatalogEntityConstructor } from "../category/category";
import type { CatalogEntity } from "./entity";
import type { BaseCatalogEntityRegistry } from "./registry";
import { catalogEntityRegistryInjectionToken } from "./registry.token";

export type GetEntitiesByClass = (classCtor: CatalogEntityConstructor<CatalogEntity>) => CatalogEntity[];

interface Dependencies {
  registry: BaseCatalogEntityRegistry;
}

const getEntitiesByClass = ({ registry }: Dependencies): GetEntitiesByClass => (
  (ctor) => registry.getItemsByEntityClass(ctor)
);

const getEntitiesByClassInjectable = getInjectable({
  instantiate: (di) => getEntitiesByClass({
    registry: di.inject(catalogEntityRegistryInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getEntitiesByClassInjectable;
