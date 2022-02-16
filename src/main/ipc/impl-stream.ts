/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { DependencyInjectionContainer } from "@ogre-tools/injectable";
import type TypedEventEmitter from "typed-emitter";
import type { IpcOneWayStream, OneWayStreamChannels } from "../../common/ipc/steam";
import broadcastMessageInjectable from "./broadcast/message.injectable";
import ipcMainInjectable from "./ipc-main.injectable";

export interface StreamSource<T> {
  data: (data: T) => void;
  close: () => void;

  /**
   * NOTE: this event should be listened on by the source
   */
  ready: () => void;
}

export interface ImplStreamOutput<T> {
  channels: OneWayStreamChannels;
  emitter: TypedEventEmitter<StreamSource<T>>;
}

export function implOneWayStream<T>(token: IpcOneWayStream<T>, init: (di: DependencyInjectionContainer) => () => ImplStreamOutput<T>) {
  return token.getMainInjectable((di, baseToken) => {
    const broadcast = di.inject(broadcastMessageInjectable);
    const ipcMain = di.inject(ipcMainInjectable);

    const handler = init(di);

    ipcMain.handle(baseToken.channel, () => {
      const { channels, emitter } = handler();
      const onData = (data: T) => broadcast(channels.data, data);
      const onReady = () => emitter.emit("ready");

      emitter.on("data", onData);
      ipcMain.on(channels.ready, onReady);
      emitter.once("close", () => {
        broadcast(channels.close);
        emitter.off("data", onData);
        ipcMain.off(channels.ready, onReady);
      });

      return emitter;
    });
  });
}
