/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { type BrowserWindow, app, dialog } from "electron";
import { appName, isWindows, productName } from "../../common/vars";
import { copyright } from "../../../package.json";

export function showAbout(browserWindow: BrowserWindow) {
  const appInfo = [
    `${appName}: ${app.getVersion()}`,
    `Electron: ${process.versions.electron}`,
    `Chrome: ${process.versions.chrome}`,
    `Node: ${process.versions.node}`,
    copyright,
  ];

  dialog.showMessageBoxSync(browserWindow, {
    title: `${isWindows ? " ".repeat(2) : ""}${appName}`,
    type: "info",
    buttons: ["Close"],
    message: productName,
    detail: appInfo.join("\r\n"),
  });
}
