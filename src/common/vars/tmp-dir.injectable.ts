/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { tmpdir } from "os";

const tmpDirInjectable = getInjectable({
  instantiate: () => tmpdir(),
  lifecycle: lifecycleEnum.singleton,
});

export default tmpDirInjectable;
