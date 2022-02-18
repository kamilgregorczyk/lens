/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { observable, observe } from "mobx";
import type { LensExtension } from "../../extensions/lens-extension";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import extensionInstancesInjectable from "./instances.injectable";
import nonInstanceExtensionNamesInjectable from "./non-instance-extension-names.injectable";

/**
 * Get an instance by its name in the manifest.
 * @param name extension name
 * @returns the instance if found, `false` if the extension is installed but does not have an instance for this "side", and `undefined` otherwise
 */
export type GetInstanceByName = (name: string) => LensExtension | undefined | false;

const extensionInstancesByNameInjectable = getInjectable({
  instantiate: (di): GetInstanceByName => {
    const state = observable.map();
    const instances = di.inject(extensionInstancesInjectable);
    const nonInstanceExtensionName = di.inject(nonInstanceExtensionNamesInjectable);

    observe(instances, change => {
      switch (change.type) {
        case "add":
          if (state.has(change.newValue.name)) {
            throw new TypeError("Extension names must be unique");
          }

          state.set(change.newValue.name, change.newValue);
          break;
        case "delete":
          state.delete(change.oldValue.name);
          break;
        case "update":
          throw new Error("Extension instances shouldn't be updated");
      }
    });

    return (name) => {
      if (nonInstanceExtensionName.has(name)) {
        return false;
      }

      return state.get(name);
    };
  },
  lifecycle: lifecycleEnum.singleton,
});

export default extensionInstancesByNameInjectable;
