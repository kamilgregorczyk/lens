/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { action, computed, observable, makeObservable } from "mobx";
import { Disposer, ExtendedMap, iter } from "../../../common/utils";
import type { CatalogEntity, CatalogEntityData, CatalogEntityKindData } from "../../../common/catalog/entity/entity";
import { once } from "lodash";
import type { CatalogCategory } from "../../../common/catalog/category";

export type CategoryFilter = (category: CatalogCategory) => any;

export class CatalogCategoryRegistry {
  protected categories = observable.set<CatalogCategory>();
  protected groupKinds = new ExtendedMap<string, ExtendedMap<string, CatalogCategory>>();
  protected filters = observable.set<CategoryFilter>([], {
    deep: false,
  });

  constructor() {
    makeObservable(this);
  }

  @action add(category: CatalogCategory): Disposer {
    this.categories.add(category);
    this.groupKinds
      .getOrInsert(category.spec.group, ExtendedMap.new)
      .strictSet(category.spec.names.kind, category);

    return () => {
      this.categories.delete(category);
      this.groupKinds.get(category.spec.group).delete(category.spec.names.kind);
    };
  }

  @computed get items() {
    return Array.from(this.categories);
  }

  @computed get filteredItems() {
    return Array.from(
      iter.reduce(
        this.filters,
        iter.filter,
        this.items.values(),
      ),
    );
  }


  getForGroupKind(group: string, kind: string): CatalogCategory | undefined {
    return this.groupKinds.get(group)?.get(kind);
  }

  getEntityForData(data: CatalogEntityData & CatalogEntityKindData): CatalogEntity | undefined {
    const category = this.getCategoryForEntity(data);

    if (!category) {
      return undefined;
    }

    const splitApiVersion = data.apiVersion.split("/");
    const version = splitApiVersion[1];

    const specVersion = category.spec.versions.find((v) => v.name === version);

    if (!specVersion) {
      return undefined;
    }

    return new specVersion.entityClass(data);
  }

  getCategoryForEntity(data: CatalogEntityData & CatalogEntityKindData): CatalogCategory | undefined {
    const splitApiVersion = data.apiVersion.split("/");
    const group = splitApiVersion[0];

    return this.getForGroupKind(group, data.kind);
  }

  getByName(name: string) {
    return this.items.find(category => category.metadata?.name == name);
  }

  /**
   * Add a new filter to the set of category filters
   * @param fn The function that should return a truthy value if that category should be displayed
   * @returns A function to remove that filter
   */
  addFilter(fn: CategoryFilter): Disposer {
    this.filters.add(fn);

    return once(() => void this.filters.delete(fn));
  }
}
