/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { Stats } from "fs";
import fsInjectable from "./fs.injectable";

export type Stat = (path: string) => Promise<Stats>;

const statInjectable = getInjectable({
  instantiate: (di) => di.inject(fsInjectable).stat as Stat,
  lifecycle: lifecycleEnum.singleton,
});

export default statInjectable;
