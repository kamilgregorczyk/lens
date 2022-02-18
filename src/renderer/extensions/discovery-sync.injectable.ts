/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import isExtensionDiscoveryLoadedInjectable from "./discovery-is-loaded.injectable";
import extensionsDiscoveryLoggerInjectable from "../../main/extensions/discovery/logger.injectable";
import requestExtensionDiscoverySyncStreamInjectable from "../ipc/extensions/discovery-sync.injectable";
import installedExtensionsInjectable from "../../common/extensions/installed.injectable";
import { convertFromRawExtension } from "../../common/extensions/sync-types";

const extensionsDiscoverySyncInjectable = getInjectable({
  setup: (di) => {
    const requestExtensionDiscoverySyncStream = di.inject(requestExtensionDiscoverySyncStreamInjectable);
    const isExtensionDiscoveryLoaded = di.inject(isExtensionDiscoveryLoadedInjectable);
    const installedExtensions = di.inject(installedExtensionsInjectable);
    const logger = di.inject(extensionsDiscoveryLoggerInjectable);

    requestExtensionDiscoverySyncStream({
      onClose: () => logger.info("sync has closed"),
      onConnectionError: (error) => logger.error("failed to start sync", error),
      onData: (message) => {
        /**
         * Loaded means that discovery has found at least one extension, and we will always have
         * at least one in tree extension
         */
        isExtensionDiscoveryLoaded.set(true);

        switch (message.type) {
          case "add":
            installedExtensions.set(message.data.id, convertFromRawExtension(message.data));
            break;
          case "delete":
            installedExtensions.delete(message.uid);
            break;
        }
      },
    });
  },
  instantiate: () => undefined,
  lifecycle: lifecycleEnum.singleton,
});

export default extensionsDiscoverySyncInjectable;
