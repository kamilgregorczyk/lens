/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { initClusterFrame } from "./init";
import extensionsLoaderInjectable from "../../../common/extensions/loader/loader.injectable";
import catalogEntityRegistryInjectable from "../../catalog/entity/registry.injectable";
import frameRoutingIdInjectable from "../../electron/frame-routing-id.injectable";
import appEventBusInjectable from "../../../common/app-event-bus/app-event-bus.injectable";
import clusterFrameContextInjectable from "../../cluster-frame-context/cluster-frame-context.injectable";
import hostedClusterInjectable from "../../clusters/hosted-cluster.injectable";
import errorNotificationInjectable from "../../components/notifications/error.injectable";
import clusterFrameLoggerInjectable from "./logger.injectable";

const initClusterFrameInjectable = getInjectable({
  instantiate: (di) =>
    initClusterFrame({
      hostedCluster: di.inject(hostedClusterInjectable),
      loadExtensions: di.inject(extensionsLoaderInjectable).loadOnClusterRenderer,
      catalogEntityRegistry: di.inject(catalogEntityRegistryInjectable),
      frameRoutingId: di.inject(frameRoutingIdInjectable),
      emitEvent: di.inject(appEventBusInjectable).emit,
      clusterFrameContext: di.inject(clusterFrameContextInjectable),
      errorNotification: di.inject(errorNotificationInjectable),
      logger: di.inject(clusterFrameLoggerInjectable),
    }),

  lifecycle: lifecycleEnum.singleton,
});

export default initClusterFrameInjectable;
