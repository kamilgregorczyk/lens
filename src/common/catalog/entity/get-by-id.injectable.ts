/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { CatalogEntity } from "./entity";
import { catalogEntityRegistryInjectionToken } from "./registry.token";
import type { BaseCatalogEntityRegistry } from "./registry";

export type GetEntityById = (id: string) => CatalogEntity | undefined;

interface Dependencies {
  registry: BaseCatalogEntityRegistry;
}

const getEntityById = ({ registry }: Dependencies): GetEntityById => (
  (id) => registry.getById(id)
);

const getEntityByIdInjectable = getInjectable({
  instantiate: (di) => getEntityById({
    registry: di.inject(catalogEntityRegistryInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getEntityByIdInjectable;
