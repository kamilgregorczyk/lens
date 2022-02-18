/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { requestExtensionDiscoverySyncStreamInjectionToken } from "../../../common/ipc/extensions/discovery-sync.token";
import { implOneWayStream, StreamSource } from "../impl-stream";
import type TypedEventEmitter from "typed-emitter";
import EventEmitter from "events";
import { observe } from "mobx";
import { disposer, toJS } from "../../../common/utils";
import { convertToRawExtension, ExtensionDiscoverySyncMessage } from "../../../common/extensions/sync-types";
import installedExtensionsInjectable from "../../../common/extensions/installed.injectable";

const requestExtensionDiscoverySyncStreamInjectable = implOneWayStream(requestExtensionDiscoverySyncStreamInjectionToken, (di) => {
  const installedExtensions = di.inject(installedExtensionsInjectable);

  return () => {
    const emitter: TypedEventEmitter<StreamSource<ExtensionDiscoverySyncMessage>> = new EventEmitter();
    const onClose = disposer();
    const onReady = () => {
      onClose.push(observe(installedExtensions, (change) => {
        switch (change.type) {
          case "add":
            emitter.emit("data", {
              type: "add",
              data: convertToRawExtension(toJS(change.newValue)),
            });
            break;
          case "delete":
            emitter.emit("data", {
              type: "delete",
              uid: change.name,
            });
            break;
          case "update":
            throw new Error("Updating extensions directly is unsupported");
        }
      }));
    };

    emitter.once("ready", onReady);
    onClose.push(() => emitter.off("ready", onReady));

    emitter.once("close", onClose);

    return emitter;
  };
});

export default requestExtensionDiscoverySyncStreamInjectable;
