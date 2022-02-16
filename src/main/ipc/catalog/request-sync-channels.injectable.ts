/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { requestCatalogSyncStreamInjectionToken } from "../../../common/ipc/catalog/sync.token";
import type { OneWayStreamChannels } from "../../../common/ipc/steam";
import * as uuid from "uuid";
import { implOneWayStream, StreamSource } from "../impl-stream";
import type { CatalogSyncMessage } from "../../../common/catalog/entity/sync-types";
import EventEmitter from "events";
import type TypedEventEmitter from "typed-emitter";
import catalogSyncEmitterInjectable from "../../catalog/sync/emitter.injectable";

const catalogSyncStreamChannelsHandleInjectable = implOneWayStream(requestCatalogSyncStreamInjectionToken, (di) => {
  return () => {
    const channels: OneWayStreamChannels = {
      close: `close-${uuid.v4()}`,
      data: `data-${uuid.v4()}`,
      ready: `ready-${uuid.v4()}`,
    };
    const emitter: TypedEventEmitter<StreamSource<CatalogSyncMessage>> = new EventEmitter();
    const syncEmitter = di.inject(catalogSyncEmitterInjectable);

    emitter.once("ready", () => {
      for (const data of syncEmitter.initial()) {
        emitter.emit("data", {
          type: "add",
          data,
        });
      }
    });
    syncEmitter.emitter
      .on("add", (data) => emitter.emit("data", {
        type: "add",
        data,
      }))
      .on("delete", (uid) => emitter.emit("data", {
        type: "delete",
        uid,
      }))
      .on("update", (uid, data) => emitter.emit("data", {
        type: "update",
        data,
        uid,
      }));

    return {
      channels,
      emitter,
    };
  };
});

export default catalogSyncStreamChannelsHandleInjectable;
