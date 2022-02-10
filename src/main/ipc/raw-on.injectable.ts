/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { IpcMain } from "electron";
import ipcMainInjectable from "./ipc-main.injectable";

export type RawOn = (channel: string, listener: (event: Electron.IpcMainEvent, ...args: any[]) => any) => void;

interface Dependencies {
  ipcMain: IpcMain;
}

const rawOn = ({ ipcMain }: Dependencies): RawOn => (
  (channel, listener) => ipcMain.on(channel, listener)
);

const rawOnInjectable = getInjectable({
  instantiate: (di) => rawOn({
    ipcMain: di.inject(ipcMainInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default rawOnInjectable;
