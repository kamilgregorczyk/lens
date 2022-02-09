/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createExtensionsStoreInjectable from "../../common/extensions/create-store.injectable";

const extensionsStoreInjectable = getInjectable({
  instantiate: (di) => {
    const createExtensionsStore = di.inject(createExtensionsStoreInjectable);

    return createExtensionsStore({});
  },
  lifecycle: lifecycleEnum.singleton,
});

export default extensionsStoreInjectable;
