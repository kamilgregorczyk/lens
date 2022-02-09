/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import directoryForUserDataInjectable from "../app-paths/directory-for-user-data.injectable";
import type { BaseStoreParams } from "../base-store";
import extensionsStoreLoggerInjectable from "./logger.injectable";
import { ExtensionsStore, ExtensionsStoreDependencies, ExtensionsStoreModel } from "./store";

const createExtensionsStoreInjectable = getInjectable({
  instantiate: (di) => {
    const deps: ExtensionsStoreDependencies = {
      userDataPath: di.inject(directoryForUserDataInjectable),
      logger: di.inject(extensionsStoreLoggerInjectable),
    };

    return (params: BaseStoreParams<ExtensionsStoreModel>) => new ExtensionsStore(deps, params);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default createExtensionsStoreInjectable;
