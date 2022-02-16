/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";

const isMacInjectable = getInjectable({
  instantiate: () => process.platform === "darwin",
  lifecycle: lifecycleEnum.singleton,
});

export default isMacInjectable;
