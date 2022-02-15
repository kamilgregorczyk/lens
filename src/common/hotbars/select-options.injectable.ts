/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { hotbarStoreInjectionToken } from "./store-injection-token";

const hotbarSelectOptionsInjectable = getInjectable({
  instantiate: (di) => di.inject(hotbarStoreInjectionToken).selectOptions,
  lifecycle: lifecycleEnum.singleton,
});

export default hotbarSelectOptionsInjectable;
