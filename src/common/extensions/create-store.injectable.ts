/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { BaseStoreParams } from "../base-store";
import directoryForUserDataInjectable from "../directory-path/user-data.injectable";
import extensionsStoreLoggerInjectable from "./logger.injectable";
import { ExtensionsStore, ExtensionsStoreDependencies, ExtensionsStoreModel } from "./store";

const createExtensionsStoreInjectable = getInjectable({
  instantiate: (di) => {
    const deps: ExtensionsStoreDependencies = {
      logger: di.inject(extensionsStoreLoggerInjectable),
      userDataPath: di.inject(directoryForUserDataInjectable),
    };

    return (params: BaseStoreParams<ExtensionsStoreModel>) => new ExtensionsStore(deps, params);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default createExtensionsStoreInjectable;
