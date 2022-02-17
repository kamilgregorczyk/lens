/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { CopyOptions } from "fs-extra";
import fsInjectable from "./fs.injectable";

export type CopyDir = (src: string, dest: string, options?: CopyOptions) => Promise<void>;

const copyDirInjectable = getInjectable({
  instantiate: (di): CopyDir => di.inject(fsInjectable).copy,
  lifecycle: lifecycleEnum.singleton,
});

export default copyDirInjectable;
