/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { WebContents, webContents } from "electron";

export type GetAllWebContents = () => WebContents[];

const getAllWebContentsInjectable = getInjectable({
  instantiate: (): GetAllWebContents => () => {
    const res = webContents.getAllWebContents();

    if (!Array.isArray(res)) {
      return [];
    }

    return res;
  },
  lifecycle: lifecycleEnum.singleton,
});

export default getAllWebContentsInjectable;
