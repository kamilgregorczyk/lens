/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import directoryForUserDataInjectable from "../app-paths/directory-for-user-data.injectable";
import type { BaseStoreParams } from "../base-store";
import { createClusterInjectionToken } from "../cluster/create-cluster-injection-token";
import { ClusterStore, ClusterStoreDependencies, ClusterStoreModel } from "./cluster-store";
import clusterStoreLoggerInjectable from "./logger.injectable";

const createClusterStoreInjectable = getInjectable({
  instantiate: (di) => {
    const dependencies: ClusterStoreDependencies = {
      createCluster: di.inject(createClusterInjectionToken),
      logger: di.inject(clusterStoreLoggerInjectable),
      userDataPath: di.inject(directoryForUserDataInjectable),
    };

    return (params: BaseStoreParams<ClusterStoreModel>) => new ClusterStore(dependencies, params);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default createClusterStoreInjectable;
