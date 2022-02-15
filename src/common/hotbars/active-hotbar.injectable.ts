/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { hotbarStoreInjectionToken } from "./store-injection-token";

const activeHotbarInjectable = getInjectable({
  instantiate: (di) => di.inject(hotbarStoreInjectionToken).active,
  lifecycle: lifecycleEnum.singleton,
});

export default activeHotbarInjectable;
