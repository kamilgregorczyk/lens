/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { DockTabStore, DockTabStoreOptions } from "./dock-tab.store";
import createStorageInjectable from "../../../utils/create-storage/create-storage.injectable";

const createDockTabStoreInjectable = getInjectable({
  instantiate: (di) => {
    const dependencies = {
      createStorage: di.inject(createStorageInjectable),
    };

    return <T>(options: DockTabStoreOptions = {}) => new DockTabStore<T>(dependencies, options);
  },

  lifecycle: lifecycleEnum.singleton,
});

export default createDockTabStoreInjectable;
