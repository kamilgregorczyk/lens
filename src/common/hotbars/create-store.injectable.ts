/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { BaseStoreParams } from "../base-store";
import { HotbarStore, HotbarStoreDependencies, HotbarStoreModel } from "./store";
import hotbarStoreLoggerInjectable from "./logger.injectable";
import directoryForUserDataInjectable from "../directory-path/user-data.injectable";

const createHotbarStoreInjectable = getInjectable({
  instantiate: (di) => {
    const deps: HotbarStoreDependencies = {
      logger: di.inject(hotbarStoreLoggerInjectable),
      userDataPath: di.inject(directoryForUserDataInjectable),
    };

    return (params: BaseStoreParams<HotbarStoreModel>) => new HotbarStore(deps, params);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default createHotbarStoreInjectable;
