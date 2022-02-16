/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import directoryForKubeConfigsInjectable from "../../../../common/directory-path/local-kube-configs.injectable";
import { KubeconfigSyncManager } from "./manager";
import { createClusterInjectionToken } from "../../../../common/clusters/create-cluster-injection-token";

const kubeconfigSyncManagerInjectable = getInjectable({
  instantiate: (di) => new KubeconfigSyncManager({
    directoryForKubeConfigs: di.inject(directoryForKubeConfigsInjectable),
    createCluster: di.inject(createClusterInjectionToken),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default kubeconfigSyncManagerInjectable;
