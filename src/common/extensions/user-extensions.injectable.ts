/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed } from "mobx";
import enabledExtensionsInjectable from "./enabled-extensions.injectable";

const userExtensionsInjectable = getInjectable({
  lifecycle: lifecycleEnum.singleton,

  instantiate: (di) => {
    const enabledExtensions = di.inject(enabledExtensionsInjectable);

    return computed(() => enabledExtensions.get().filter(extension => !extension.isBundled));
  },
});

export default userExtensionsInjectable;
