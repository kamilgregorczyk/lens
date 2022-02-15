/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { CatalogEntityConstructor } from "../category";
import type { CatalogEntity } from "./entity";

export interface BaseCatalogEntityRegistry {
  getById(id: string): CatalogEntity | undefined;
  getItemsForApiKind(apiVersion: string, kind: string): CatalogEntity[];
  getItemsByEntityClass(constructor: CatalogEntityConstructor<CatalogEntity>): CatalogEntity[];
}
