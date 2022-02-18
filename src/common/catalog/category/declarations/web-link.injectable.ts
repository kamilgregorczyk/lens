/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { addCatalogCategoryInjectionToken } from "../add-category.token";
import { WebLinkCategory } from "./web-link";

const webLinkCatalogCategoryInjectable = getInjectable({
  instantiate: (di) => {
    const addCatalogCategory = di.inject(addCatalogCategoryInjectionToken);
    const webLinkCategory = new WebLinkCategory();

    addCatalogCategory(webLinkCategory);

    return webLinkCategory;
  },
  lifecycle: lifecycleEnum.singleton,
});

export default webLinkCatalogCategoryInjectable;
