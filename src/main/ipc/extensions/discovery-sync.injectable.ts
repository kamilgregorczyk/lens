/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { requestExtensionDiscoverySyncStreamInjectionToken } from "../../../common/ipc/extensions/discovery-sync.token";
import extensionDiscoveryInjectable from "../../../extensions/discovery/discovery.injectable";
import { implOneWayStream, StreamSource } from "../impl-stream";
import type TypedEventEmitter from "typed-emitter";
import type { ExtensionDiscoveryState } from "../../../extensions/discovery/discovery";
import EventEmitter from "events";
import { reaction } from "mobx";
import { disposer } from "../../../common/utils";

const requestExtensionDiscoverySyncStreamInjectable = implOneWayStream(requestExtensionDiscoverySyncStreamInjectionToken, (di) => {
  const discovery = di.inject(extensionDiscoveryInjectable);

  return () => {
    const emitter: TypedEventEmitter<StreamSource<ExtensionDiscoveryState>> = new EventEmitter();
    const onClose = disposer();
    const onReady = () => {
      onClose.push(reaction(
        () => discovery.getState(),
        state => emitter.emit("data", state),
        {
          fireImmediately: true,
        },
      ));
    };

    emitter.once("ready", onReady);
    onClose.push(() => emitter.off("ready", onReady));

    emitter.once("close", onClose);

    return emitter;
  };
});

export default requestExtensionDiscoverySyncStreamInjectable;
