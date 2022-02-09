/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import directoryForUserDataInjectable from "../app-paths/directory-for-user-data.injectable";
import type { BaseStoreParams } from "../base-store";
import weblinkStoreLoggerInjectable from "./logger.injectable";
import { WeblinkStore, WeblinkStoreDependencies, WeblinkStoreModel } from "./weblink-store";

const createWeblinkStoreInjectable = getInjectable({
  instantiate: (di) => {
    const deps: WeblinkStoreDependencies = {
      logger: di.inject(weblinkStoreLoggerInjectable),
      userDataPath: di.inject(directoryForUserDataInjectable),
    };

    return (params: BaseStoreParams<WeblinkStoreModel>) => new WeblinkStore(deps, params);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default createWeblinkStoreInjectable;
