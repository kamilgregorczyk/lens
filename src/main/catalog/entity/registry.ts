/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { action, computed, IComputedValue, IObservableArray, makeObservable, observable } from "mobx";
import type { CatalogEntityConstructor } from "../../../common/catalog/category";
import type { CatalogEntity } from "../../../common/catalog/entity/entity";
import type { BaseCatalogEntityRegistry } from "../../../common/catalog/entity/registry";
import { iter } from "../../../common/utils";
import type { CatalogCategoryRegistry } from "../category/registry";

export interface CatalogEntityRegistryDependencies {
  readonly categoryRegistry: CatalogCategoryRegistry;
}

export class CatalogEntityRegistry implements BaseCatalogEntityRegistry {
  protected sources = observable.map<string, IComputedValue<CatalogEntity[]>>();

  constructor(protected readonly dependencies: CatalogEntityRegistryDependencies) {
    makeObservable(this);
  }

  @action addObservableSource(id: string, source: IObservableArray<CatalogEntity>) {
    this.sources.set(id, computed(() => source));
  }

  @action addComputedSource(id: string, source: IComputedValue<CatalogEntity[]>) {
    this.sources.set(id, source);
  }

  @action removeSource(id: string) {
    this.sources.delete(id);
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
