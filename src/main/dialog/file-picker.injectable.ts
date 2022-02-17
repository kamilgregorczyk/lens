/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { BrowserWindow, dialog, OpenDialogOptions } from "electron";

export type FilePickingResult = {
  canceled: true;
} | {
  canceled: false;
  filePaths: string[]
};

async function openFilePicker(browserWindow: BrowserWindow, options: OpenDialogOptions): Promise<FilePickingResult> {
  const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, options);

  if (canceled) {
    return { canceled };
  }

  return {
    canceled: false,
    filePaths,
  };
}

const openFileDialogInjectable = getInjectable({
  instantiate: () => openFilePicker,
  lifecycle: lifecycleEnum.singleton,
});

export default openFileDialogInjectable;
