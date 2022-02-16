/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { FSWatcher, WatchOptions } from "chokidar";

export type CreateWatcher = (options?: WatchOptions) => FSWatcher;

const createWatcherInjectable = getInjectable({
  instantiate: (): CreateWatcher => (
    (options) => new FSWatcher(options)
  ),
  lifecycle: lifecycleEnum.singleton,
});

export default createWatcherInjectable;
