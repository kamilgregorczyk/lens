/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed } from "mobx";
import userPreferencesStoreInjectableInjectable from "../../main/user-pereferences/store.injectable";

const kubectlBinariesPathInjectable = getInjectable({
  instantiate: (di) => {
    const store = di.inject(userPreferencesStoreInjectableInjectable);

    return computed(() => store.kubectlBinariesPath);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default kubectlBinariesPathInjectable;
