/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed } from "mobx";
import userPereferencesStoreInjectableInjectable from "../../main/user-pereferences/store.injectable";

const kubectlBinariesPathInjectable = getInjectable({
  instantiate: (di) => {
    const store = di.inject(userPereferencesStoreInjectableInjectable);

    return computed(() => store.kubectlBinariesPath);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default kubectlBinariesPathInjectable;
