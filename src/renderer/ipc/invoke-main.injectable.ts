/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { ipcRenderer } from "electron";

const invokeInjectable = getInjectable({
  instantiate: () => (
    (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args)
  ),
  lifecycle: lifecycleEnum.singleton,
});

export default invokeInjectable;
