/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import isExtensionDiscoveryLoadedInjectable from "../../common/extensions/is-loaded.injectable";
import extensionsDiscoveryLoggerInjectable from "../../main/extensions/discovery/logger.injectable";
import requestExtensionDiscoverySyncStreamInjectable from "../ipc/extensions/discovery-sync.injectable";

const extensionsDiscoverySyncInjectable = getInjectable({
  setup: (di) => {
    const requestExtensionDiscoverySyncStream = di.inject(requestExtensionDiscoverySyncStreamInjectable);
    const isExtensionDiscoveryLoaded = di.inject(isExtensionDiscoveryLoadedInjectable);
    const logger = di.inject(extensionsDiscoveryLoggerInjectable);

    requestExtensionDiscoverySyncStream({
      onClose: () => logger.info("sync has closed"),
      onConnectionError: (error) => logger.error("failed to start sync", error),
      onData: ({ isLoaded }) => isExtensionDiscoveryLoaded.set(isLoaded),
    });
  },
  instantiate: () => undefined,
  lifecycle: lifecycleEnum.singleton,
});

export default extensionsDiscoverySyncInjectable;
