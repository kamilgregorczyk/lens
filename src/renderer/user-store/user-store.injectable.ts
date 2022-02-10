/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createUserStoreInjectable from "../../common/user-preferences/create-store.injectable";
import { userStoreInjectionToken } from "../../common/user-preferences/store-injection-token";

const userStoreInjectableInjectable = getInjectable({
  instantiate: (di) => {
    const createUserStore = di.inject(createUserStoreInjectable);

    return createUserStore({});
  },
  injectionToken: userStoreInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default userStoreInjectableInjectable;
