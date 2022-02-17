/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import extensionDiscoveryInjectable from "../../extensions/discovery/discovery.injectable";
import extensionsDiscoverLoggerInjectable from "../../extensions/discovery/logger.injectable";
import requestExtensionDiscoverySyncStreamInjectable from "../ipc/extensions/discovery-sync.injectable";

const extensionsDiscoverySyncInjectable = getInjectable({
  setup: (di) => {
    const requestExtensionDiscoverySyncStream = di.inject(requestExtensionDiscoverySyncStreamInjectable);
    const discovery = di.inject(extensionDiscoveryInjectable);
    const logger = di.inject(extensionsDiscoverLoggerInjectable);

    requestExtensionDiscoverySyncStream({
      onClose: () => logger.info("sync has closed"),
      onConnectionError: (error) => logger.error("failed to start sync", error),
      onData: (state) => discovery.setState(state),
    });
  },
  instantiate: () => undefined,
  lifecycle: lifecycleEnum.singleton,
});

export default extensionsDiscoverySyncInjectable;
