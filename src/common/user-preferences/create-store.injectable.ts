/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import appEventBusInjectable from "../app-event-bus/app-event-bus.injectable";
import type { BaseStoreParams } from "../base-store";
import directoryForUserDataInjectable from "../paths/user-data.injectable";
import userStoreLoggerInjectable from "./logger.injectable";
import { UserPereferencesStore, UserStoreDependencies, UserPereferencesStoreModel } from "./store";

const createUserStoreInjectable = getInjectable({
  instantiate: (di) => {
    const dependencies: UserStoreDependencies = {
      logger: di.inject(userStoreLoggerInjectable),
      userDataPath: di.inject(directoryForUserDataInjectable),
      appEventBus: di.inject(appEventBusInjectable),
    };

    return (params: BaseStoreParams<UserPereferencesStoreModel>) => new UserPereferencesStore(dependencies, params);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default createUserStoreInjectable;
