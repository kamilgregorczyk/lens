/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { Disposer } from "../../utils";
import type { CatalogCategoryRegistry, CategoryFilter } from "./registry";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import catalogCategoryRegistryInjectable from "./registry.injectable";

export type AddCategoryFilter = (fn: CategoryFilter) => Disposer;

interface Dependencies {
  registry: CatalogCategoryRegistry;
}

const addCategoryFilter = ({ registry }: Dependencies): AddCategoryFilter => (
  (fn) => registry.addFilter(fn)
);

const addCategoryFilterInjectable = getInjectable({
  instantiate: (di) => addCategoryFilter({
    registry: di.inject(catalogCategoryRegistryInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default addCategoryFilterInjectable;

