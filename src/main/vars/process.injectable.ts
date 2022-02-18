/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { lensProcessInjectionToken } from "../../common/vars/process.token";

const lensProcessInjectable = getInjectable({
  instantiate: () => "main",
  injectionToken: lensProcessInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default lensProcessInjectable;
