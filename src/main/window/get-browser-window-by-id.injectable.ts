/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { BrowserWindow } from "electron";

const getBrowserWindowByIdInjectable = getInjectable({
  instantiate: () => (id: number) => BrowserWindow.fromId(id),
  lifecycle: lifecycleEnum.singleton,
});

export default getBrowserWindowByIdInjectable;
