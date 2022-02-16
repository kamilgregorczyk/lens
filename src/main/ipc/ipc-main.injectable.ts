/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { ipcMain } from "electron";

const ipcMainInjectable = getInjectable({
  instantiate: () => ipcMain,
  causesSideEffects: true,
  lifecycle: lifecycleEnum.singleton,
});

export default ipcMainInjectable;
