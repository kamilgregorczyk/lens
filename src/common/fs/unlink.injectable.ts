/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import fsInjectable from "./fs.injectable";

export type Unlink = (path: string) => Promise<void>;

const unlinkInjectable = getInjectable({
  instantiate: (di): Unlink => di.inject(fsInjectable).unlink,
  lifecycle: lifecycleEnum.singleton,
});

export default unlinkInjectable;
