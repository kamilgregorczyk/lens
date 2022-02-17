/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createExtensionsPreferencesStoreInjectable from "../../common/extensions/preferences/create-store.injectable";
import { extensionsPreferencesStoreInjectionToken } from "../../common/extensions/preferences/store-injection-token";

const extensionsPreferencesStoreInjectable = getInjectable({
  instantiate: (di) => {
    const createExtensionsStore = di.inject(createExtensionsPreferencesStoreInjectable);

    return createExtensionsStore({});
  },
  injectionToken: extensionsPreferencesStoreInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default extensionsPreferencesStoreInjectable;
