/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { ipcRenderer } from "electron";

const sendInjectable = getInjectable({
  instantiate: () => (
    (channel: string, ...args: any[]): void => {
      ipcRenderer.send(channel, ...args);
    }
  ),
  lifecycle: lifecycleEnum.singleton,
});

export default sendInjectable;
