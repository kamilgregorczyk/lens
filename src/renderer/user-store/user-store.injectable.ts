/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import directoryForUserDataInjectable from "../../common/app-paths/directory-for-user-data.injectable";
import { UserStore } from "../../common/user-store/user-store";
import { userStoreInjectionToken } from "../../common/user-store/user-store-injection-token";

const userStoreInjectableInjectable = getInjectable({
  instantiate: (di) => new UserStore({
    userDataPath: di.inject(directoryForUserDataInjectable),
  }),
  injectionToken: userStoreInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default userStoreInjectableInjectable;
