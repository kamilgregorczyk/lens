/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import fsInjectable from "./fs.injectable";

const removeInjectable = getInjectable({
  instantiate: (di) => di.inject(fsInjectable).remove,
  lifecycle: lifecycleEnum.singleton,
});

export default removeInjectable;
