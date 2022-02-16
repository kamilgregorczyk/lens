/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { IpcOneWayStream } from "../../common/ipc/steam";
import ipcRendererInjectable from "./ipc-renderer.injectable";

export function implOneWayStream<T>(token: IpcOneWayStream<T>) {
  return token.getRendererInjectable((di, connectChannel) => {
    const ipcRenderer = di.inject(ipcRendererInjectable);
    const requestChannels = di.inject(connectChannel.token);

    return (listeners) => {
      (async () => {
        try {
          const { data, close, ready } = await requestChannels();
          const onData = (event: any, data: T) => listeners.onData(data);

          ipcRenderer.on(data, onData);
          ipcRenderer.once(close, () => {
            ipcRenderer.off(data, onData);
            listeners.onClose();
          });

          ipcRenderer.send(ready);
        } catch (error) {
          listeners.onConnectionError(error);
        }
      })();
    };
  });
}
