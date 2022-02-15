/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { CatalogCategory } from "../../../common/catalog/category";
import type { CatalogEntity } from "../../../common/catalog/entity/entity";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import catalogCategoryRegistryInjectable from "./registry.injectable";
import type { CatalogCategoryRegistry } from "./registry";

export type GetCategoryForEntity = (entity: CatalogEntity) => CatalogCategory | undefined;

interface Dependencies {
  registry: CatalogCategoryRegistry;
}

const getCategoryForEntity = ({ registry }: Dependencies): GetCategoryForEntity => (
  (entity) => registry.getCategoryForEntity(entity)
);

const getCategoryForEntityInjectable = getInjectable({
  instantiate: (di) => getCategoryForEntity({
    registry: di.inject(catalogCategoryRegistryInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getCategoryForEntityInjectable;

