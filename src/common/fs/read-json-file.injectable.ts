/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import fsInjectable from "./fs.injectable";

const readJsonFileInjectable = getInjectable({
  instantiate: (di) => di.inject(fsInjectable).readJson,
  lifecycle: lifecycleEnum.singleton,
});

export default readJsonFileInjectable;
