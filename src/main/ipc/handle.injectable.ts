/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { IpcMain } from "electron";
import ipcMainInjectable from "./ipc-main.injectable";

export type Handle = (channel: string, listener: (...args: any[]) => any) => void;

interface Dependencies {
  ipcMain: IpcMain;
}

export const handle = ({ ipcMain }: Dependencies): Handle => (
  (channel, listener) => ipcMain.handle(channel, (event, ...args) => listener(...args))
);

const handleInjectable = getInjectable({
  instantiate: (di) => handle({
    ipcMain: di.inject(ipcMainInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default handleInjectable;
