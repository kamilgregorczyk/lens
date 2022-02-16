/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";

const isWindowsInjectable = getInjectable({
  instantiate: () => process.platform === "win32",
  lifecycle: lifecycleEnum.singleton,
});

export default isWindowsInjectable;
