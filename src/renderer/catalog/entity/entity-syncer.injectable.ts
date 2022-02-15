/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { format } from "url";
import type { CatalogSyncMessage, EntityChangeEvents } from "../../../common/catalog/entity/sync-types";
import type { LensLogger } from "../../../common/logger";
import { apiPrefix, catalogSyncRoute } from "../../../common/vars";
import { WebSocketApi } from "../../api/websocket-api";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import catalogEntityRegistryLoggerInjectable from "../../../common/catalog/entity/registry-logger.injectable";

interface Dependencies {
  logger: LensLogger;
}

const catalogEntitySyncer = ({ logger }: Dependencies) => (
  (events: EntityChangeEvents) => {
    const { hostname, protocol, port } = location;

    const socketUrl = format({
      protocol: protocol.includes("https") ? "wss" : "ws",
      hostname,
      port,
      pathname: `${apiPrefix}${catalogSyncRoute}`,
      slashes: true,
    });

    const api = new WebSocketApi();

    api.on("data", (message) => {
      const change = JSON.parse(message) as CatalogSyncMessage;

      logger.debug(`sync event`, change);

      switch (change.type) {
        case "add":
          return events.add(change.data);
        case "update":
          return events.update(change.uid, change.data);
        case "delete":
          return events.delete(change.uid);
      }
    });

    api.connect(socketUrl);
  }
);

const catalogEntitySyncerInjectable = getInjectable({
  instantiate: (di) => catalogEntitySyncer({
    logger: di.inject(catalogEntityRegistryLoggerInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default catalogEntitySyncerInjectable;

