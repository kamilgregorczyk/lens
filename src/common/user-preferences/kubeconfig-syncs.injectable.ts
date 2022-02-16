/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { userPreferencesStoreInjectionToken } from "./store-injection-token";

const kubeconfigSyncsInjectable = getInjectable({
  instantiate: (di) => di.inject(userPreferencesStoreInjectionToken).syncKubeconfigEntries,
  lifecycle: lifecycleEnum.singleton,
});

export default kubeconfigSyncsInjectable;
