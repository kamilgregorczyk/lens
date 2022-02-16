/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { userPreferencesStoreInjectionToken } from "./store-injection-token";

const downloadKubectlBinariesInjectable = getInjectable({
  instantiate: (di) => {
    const store = di.inject(userPreferencesStoreInjectionToken);

    return computed(() => store.downloadKubectlBinaries);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default downloadKubectlBinariesInjectable;
