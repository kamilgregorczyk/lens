/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { BaseStore, BaseStoreParams } from "../common/base-store";
import * as path from "path";
import type { LensExtension } from "./lens-extension";
import type { StaticThis } from "../common/utils";
import { asLegacyGlobalFunctionForExtensionApi } from "./di-legacy-globals/as-legacy-global-function-for-extension-api";
import createChildLoggerInjectable from "../common/logger/create-child-logger.injectable";
import { asLegacyGlobalObjectForExtensionApi } from "./di-legacy-globals/as-legacy-global-object-for-extension-api";
import directoryForUserDataInjectable from "../common/paths/user-data.injectable";

const instances = new WeakMap<object, ExtensionStore<any>>();
const createChildLogger = asLegacyGlobalFunctionForExtensionApi(createChildLoggerInjectable);
const userDataPath = asLegacyGlobalObjectForExtensionApi(directoryForUserDataInjectable);

export interface ExtensionStoreParams<T> extends Omit<BaseStoreParams<T>, "name"> {
  configName: string;
}

export abstract class ExtensionStore<T> extends BaseStore<T> {
  constructor({ configName, ...params }: ExtensionStoreParams<T>) {
    super(
      {
        logger: createChildLogger(configName),
        userDataPath,
      },
      {
        name: configName,
        ...params,
      },
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
