/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { BaseStore, BaseStoreParams } from "../common/base-store";
import * as path from "path";
import type { LensExtension } from "./lens-extension";
import type { StaticThis } from "../common/utils";
import { asLegacyGlobalObjectForExtensionApi } from "./as-legacy-globals-for-extension-api/as-legacy-global-object-for-extension-api";
import directoryForUserDataInjectable from "../common/app-paths/directory-for-user-data.injectable";

const instances = new WeakMap<object, ExtensionStore<any>>();

export abstract class ExtensionStore<T> extends BaseStore<T> {
  readonly displayName = "ExtensionStore<T>";

  constructor(baseStoreParams: BaseStoreParams<T>) {
    super(
      {
        userDataPath: asLegacyGlobalObjectForExtensionApi(directoryForUserDataInjectable),
      },
      baseStoreParams,
    );
  }

  /**
   * @deprecated Just use `new T extends ExtensionStore` manually
   */
  static createInstance<T extends ExtensionStore<any>, R extends any[]>(this: StaticThis<T, R>, ...args: R): T {
    if (!instances.has(this)) {
      instances.set(this, new this(...args));
    }

    return instances.get(this) as T;
  }

  /**
   * @deprecated Just use `new T extends ExtensionStore` manually
   */
  static getInstance<T extends ExtensionStore<any>>(this: StaticThis<T, any[]>, strict = true): T | undefined {
    if (!instances.has(this) && strict) {
      throw new TypeError(`instance of ${this.name} is not created`);
    }

    return instances.get(this) as (T | undefined);
  }

  /**
   * @deprecated Manually track the lifespan of the instance
   */
  static resetInstance() {
    instances.delete(this);
  }

  loadExtension(extension: LensExtension) {
    this.params.cwd = path.join(this.params.cwd, "extension-store", extension.name);

    return super.load();
  }

  /**
   * @deprecicated Use `loadExtension` instead
   */
  load() {
    return;
  }
}
