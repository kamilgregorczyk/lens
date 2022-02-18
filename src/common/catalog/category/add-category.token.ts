/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectionToken } from "@ogre-tools/injectable";
import type { CatalogCategory } from "./category";

export type AddCatalogCategory = (category: CatalogCategory) => void;

export const addCatalogCategoryInjectionToken = getInjectionToken<AddCatalogCategory>();
