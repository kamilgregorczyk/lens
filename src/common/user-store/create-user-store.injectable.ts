/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import directoryForUserDataInjectable from "../app-paths/directory-for-user-data.injectable";
import type { BaseStoreParams } from "../base-store";
import userStoreLoggerInjectable from "./logger.injectable";
import { UserStore, UserStoreDependencies, UserStoreModel } from "./user-store";

const createUserStoreInjectable = getInjectable({
  instantiate: (di) => {
    const dependencies: UserStoreDependencies = {
      userDataPath: di.inject(directoryForUserDataInjectable),
      logger: di.inject(userStoreLoggerInjectable),
    };

    return (params: BaseStoreParams<UserStoreModel>) => new UserStore(dependencies, params);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default createUserStoreInjectable;
