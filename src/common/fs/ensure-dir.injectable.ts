/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { EnsureOptions } from "fs-extra";
import fsInjectable from "./fs.injectable";

export type EnsureDir = (path: string, options?: number | EnsureOptions) => Promise<void>;

const ensureDirInjectable = getInjectable({
  instantiate: (di) => di.inject(fsInjectable).ensureDir,
  lifecycle: lifecycleEnum.singleton,
});

export default ensureDirInjectable;
