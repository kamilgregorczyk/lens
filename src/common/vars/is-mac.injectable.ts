/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { isMac } from "../vars";

const isMacInjectable = getInjectable({
  instantiate: () => isMac,
  lifecycle: lifecycleEnum.singleton,
});

export default isMacInjectable;
