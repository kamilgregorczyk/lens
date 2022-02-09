/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { IpcMain } from "electron";
import ipcMainInjectable from "./ipc-main.injectable";

export type RawHandle = (channel: string, listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any) => void;

interface Dependencies {
  ipcMain: IpcMain;
}

const rawHandle = ({ ipcMain }: Dependencies): RawHandle => (
  (channel, listener) => ipcMain.handle(channel, listener)
);

const rawHandleInjectable = getInjectable({
  instantiate: (di) => rawHandle({
    ipcMain: di.inject(ipcMainInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default rawHandleInjectable;
