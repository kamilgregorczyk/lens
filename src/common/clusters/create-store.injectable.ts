/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import appEventBusInjectable from "../app-event-bus/app-event-bus.injectable";
import type { BaseStoreParams } from "../base-store";
import { createClusterInjectionToken } from "../cluster/create-cluster-injection-token";
import { ClusterStore, ClusterStoreDependencies, ClusterStoreModel } from "./store";
import clusterStoreLoggerInjectable from "./logger.injectable";
import directoryForUserDataInjectable from "../directory-path/user-data.injectable";

const createClusterStoreInjectable = getInjectable({
  instantiate: (di) => {
    const dependencies: ClusterStoreDependencies = {
      createCluster: di.inject(createClusterInjectionToken),
      logger: di.inject(clusterStoreLoggerInjectable),
      appEventBus: di.inject(appEventBusInjectable),
      userDataPath: di.inject(directoryForUserDataInjectable),
    };

    return (params: BaseStoreParams<ClusterStoreModel>) => new ClusterStore(dependencies, params);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default createClusterStoreInjectable;
