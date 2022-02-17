/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { DependencyInjectionContainer } from "@ogre-tools/injectable";
import type TypedEventEmitter from "typed-emitter";
import type { IpcOneWayStream, OneWayStreamChannels } from "../../common/ipc/steam";
import { disposer } from "../../common/utils";
import broadcastMessageInjectable from "./broadcast/message.injectable";
import ipcMainInjectable from "./ipc-main.injectable";
import * as uuid from "uuid";

export interface StreamSource<T> {
  data: (data: T) => void;
  close: () => void;

  /**
   * NOTE: this event should be listened on by the source
   */
  ready: () => void;
}

export function implOneWayStream<T>(token: IpcOneWayStream<T>, init: (di: DependencyInjectionContainer) => () => TypedEventEmitter<StreamSource<T>>) {
  return token.getMainInjectable((di, baseChannel) => {
    const broadcast = di.inject(broadcastMessageInjectable);
    const ipcMain = di.inject(ipcMainInjectable);

    const handler = init(di);

    ipcMain.handle(baseChannel, () => {
      const channels: OneWayStreamChannels = {
        close: `${baseChannel}:close:${uuid.v4()}`,
        data: `${baseChannel}:data:${uuid.v4()}`,
        ready: `${baseChannel}:ready:${uuid.v4()}`,
      };
      const emitter = handler();
      const onData = (data: T) => broadcast(channels.data, data);
      const onReady = () => emitter.emit("ready");
      const onClose = disposer();

      emitter.on("data", onData);
      onClose.push(() => emitter.off("data", onData));

      ipcMain.on(channels.ready, onReady);
      onClose.push(() => ipcMain.off(channels.ready, onReady));

      // Set up back channel for the other side closing the stream
      ipcMain.once(channels.close, onClose);
      onClose.push(() => ipcMain.off(channels.close, onClose));

      // Set up closing the stream from this side
      const onEmitterClose = () => {
        onClose();
        broadcast(channels.close);
      };

      emitter.once("close", onEmitterClose);
      onClose.push(() => emitter.off("close", onEmitterClose));

      return channels;
    });
  });
}
