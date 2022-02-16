/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { BaseStoreParams } from "../base-store";
import directoryForUserDataInjectable from "../directory-path/user-data.injectable";
import userStoreLoggerInjectable from "./logger.injectable";
import { UserPereferencesStore, UserStoreDependencies, UserPereferencesStoreModel } from "./store";

const createUserStoreInjectable = getInjectable({
  instantiate: (di) => {
    const dependencies: UserStoreDependencies = {
      logger: di.inject(userStoreLoggerInjectable),
      userDataPath: di.inject(directoryForUserDataInjectable),
    };

    return (params: BaseStoreParams<UserPereferencesStoreModel>) => new UserPereferencesStore(dependencies, params);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default createUserStoreInjectable;
