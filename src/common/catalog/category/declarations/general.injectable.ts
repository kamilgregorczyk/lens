/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { addCatalogCategoryInjectionToken } from "../add-category.token";
import { GeneralCategory } from "./general";

const generalCatalogCategoryInjectable = getInjectable({
  instantiate: (di) => {
    const addCatalogCategory = di.inject(addCatalogCategoryInjectionToken);
    const generalCategory = new GeneralCategory();

    addCatalogCategory(generalCategory);

    return generalCategory;
  },
  lifecycle: lifecycleEnum.singleton,
});

export default generalCatalogCategoryInjectable;
