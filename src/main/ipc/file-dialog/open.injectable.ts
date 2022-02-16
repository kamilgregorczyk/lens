/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { openFileDialogInjectionToken } from "../../../common/ipc/file-dialog/open.token";
import openFilePickerInjectable from "../../dialog/file-picker.injectable";
import getBrowserWindowByIdInjectable from "../../window/get-browser-window-by-id.injectable";
import { implWithRawHandle } from "../impl-channel";

const openFileDialogInjectable = implWithRawHandle(openFileDialogInjectionToken, (di) => {
  const getBrowserWindowById = di.inject(getBrowserWindowByIdInjectable);
  const openFileDialog = di.inject(openFilePickerInjectable);

  return (event, options) => openFileDialog(getBrowserWindowById(event.sender.id), options);
});

export default openFileDialogInjectable;
