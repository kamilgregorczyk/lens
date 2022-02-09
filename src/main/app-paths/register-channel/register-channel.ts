/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { IpcMain } from "electron";
import type { Channel } from "../../../common/ipc-channels/channel";

interface Dependencies {
  ipcMain: IpcMain;
}

export const registerChannel =
  ({ ipcMain }: Dependencies) =>
  <TChannel extends Channel<TInstance>, TInstance>(
      channel: TChannel,
      getValue: () => TInstance,
    ) =>
      ipcMain.handle(channel.name, getValue);
