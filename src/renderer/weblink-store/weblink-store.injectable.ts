/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createWeblinkStoreInjectable from "../../common/weblinks/create-store.injectable";

const weblinkStoreInjectableInjectable = getInjectable({
  instantiate: (di) => {
    const createWeblinkStore = di.inject(createWeblinkStoreInjectable);

    return createWeblinkStore({});
  },
  lifecycle: lifecycleEnum.singleton,
});

export default weblinkStoreInjectableInjectable;
