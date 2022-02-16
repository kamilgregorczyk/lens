/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { computed, IComputedValue, observable } from "mobx";
import type { CatalogEntityConstructor } from "../../../common/catalog/category/category";
import type { CatalogEntity } from "../../../common/catalog/entity/entity";
import type { BaseCatalogEntityRegistry } from "../../../common/catalog/entity/registry";
import { Disposer, iter } from "../../../common/utils";
import type { CatalogCategoryRegistry } from "../category/registry";

export interface CatalogEntityRegistryDependencies {
  readonly categoryRegistry: CatalogCategoryRegistry;
}

export type EntitySource = IComputedValue<CatalogEntity[]>;

export class CatalogEntityRegistry implements BaseCatalogEntityRegistry {
  protected sources = observable.set<EntitySource>();

  constructor(protected readonly dependencies: CatalogEntityRegistryDependencies) {}

  addComputedSource(source: EntitySource): Disposer {
    this.sources.add(source);

    return () => {
      this.sources.delete(source);
    };
  }

  readonly entities = computed(() => Array.from(
    iter.filter(
      iter.flatMap(this.sources.values(), source => source.get()),
      entity => this.dependencies.categoryRegistry.getCategoryForEntity(entity),
    ),
  ));

  get items(): CatalogEntity[] {
    return this.entities.get();
  }

  getById(id: string): CatalogEntity | undefined {
    return this.items.find(entity => entity.getId() === id);
  }

  getItemsForApiKind(apiVersion: string, kind: string): CatalogEntity[] {
    return this.items.filter((item) => item.apiVersion === apiVersion && item.kind === kind);
  }

  getItemsByEntityClass(constructor: CatalogEntityConstructor<CatalogEntity>): CatalogEntity[] {
    return this.items.filter((item) => item instanceof constructor);
  }
}
