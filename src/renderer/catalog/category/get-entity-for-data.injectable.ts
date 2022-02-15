/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { CatalogEntityData, CatalogEntityKindData, CatalogEntity } from "../../../common/catalog/entity/entity";
import type { CatalogCategoryRegistry } from "./registry";
import catalogCategoryRegistryInjectable from "./registry.injectable";

export type GetEntityForData = (data: CatalogEntityData & CatalogEntityKindData) => CatalogEntity | undefined;

interface Dependencies {
  registry: CatalogCategoryRegistry;
}

const getEntityForData = ({ registry }: Dependencies): GetEntityForData => (
  (data) => registry.getEntityForData(data)
);

const getEntityForDataInjectable = getInjectable({
  instantiate: (di) => getEntityForData({
    registry: di.inject(catalogCategoryRegistryInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getEntityForDataInjectable;
