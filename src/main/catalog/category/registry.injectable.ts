/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { CatalogCategoryRegistry } from "./registry";

const catalogCategoryRegistryInjectable = getInjectable({
  instantiate: () => new CatalogCategoryRegistry(),
  lifecycle: lifecycleEnum.singleton,
});

export default catalogCategoryRegistryInjectable;
