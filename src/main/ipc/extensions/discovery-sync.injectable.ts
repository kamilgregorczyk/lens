/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { requestExtensionDiscoverySyncStreamInjectionToken } from "../../../common/ipc/extensions/discovery-sync.token";
import { implOneWayStream, StreamSource } from "../impl-stream";
import type TypedEventEmitter from "typed-emitter";
import type { ExtensionDiscoveryState } from "../../../extensions/discovery/discovery";
import EventEmitter from "events";
import { reaction } from "mobx";
import { disposer, toJS } from "../../../common/utils";
import isExtensionDiscoveryLoadedInjectable from "../../../common/extensions/is-loaded.injectable";

const requestExtensionDiscoverySyncStreamInjectable = implOneWayStream(requestExtensionDiscoverySyncStreamInjectionToken, (di) => {
  const isExtensionDiscoveryLoaded = di.inject(isExtensionDiscoveryLoadedInjectable);

  return () => {
    const emitter: TypedEventEmitter<StreamSource<ExtensionDiscoveryState>> = new EventEmitter();
    const onClose = disposer();
    const onReady = () => {
      onClose.push(reaction(
        () => toJS({
          isLoaded: isExtensionDiscoveryLoaded.get(),
        }),
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
