/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { action, computed, observable, makeObservable } from "mobx";
import { Disposer, ExtendedMap } from "../../../common/utils";
import type { CatalogEntity, CatalogEntityData, CatalogEntityKindData } from "../../../common/catalog/entity/entity";
import type { CatalogCategory } from "../../../common/catalog/category/category";

export type CategoryFilter = (category: CatalogCategory) => any;

export class CatalogCategoryRegistry {
  protected categorySet = observable.set<CatalogCategory>();
  protected groupKinds = new ExtendedMap<string, ExtendedMap<string, CatalogCategory>>();

  constructor() {
    makeObservable(this);
  }

  @action add(category: CatalogCategory): Disposer {
    this.categorySet.add(category);
    this.groupKinds
      .getOrInsert(category.spec.group, ExtendedMap.new)
      .strictSet(category.spec.names.kind, category);

    return () => {
      this.categorySet.delete(category);
      this.groupKinds.get(category.spec.group).delete(category.spec.names.kind);
    };
  }

  readonly categories = computed(() => [...this.categorySet]);

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
    return this.categories.get().find(category => category.metadata?.name == name);
  }
}
