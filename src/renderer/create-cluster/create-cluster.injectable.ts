/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { Cluster, ClusterDependencies } from "../../common/cluster/cluster";
import directoryForKubeConfigsInjectable from "../../common/directory-path/local-kube-configs.injectable";
import { createClusterInjectionToken } from "../../common/cluster/create-cluster-injection-token";

const createClusterInjectable = getInjectable({
  instantiate: (di) => {
    const dependencies: ClusterDependencies = {
      directoryForKubeConfigs: di.inject(directoryForKubeConfigsInjectable),
      createKubeconfigManager: () => { throw new Error("Tried to access back-end feature in front-end."); },
      createKubectl: () => { throw new Error("Tried to access back-end feature in front-end.");},
      createContextHandler: () => { throw new Error("Tried to access back-end feature in front-end."); },
      createAuthorizationReview: () => { throw new Error("Tried to access back-end feature in front-end."); },
      createListNamespaces: () => { throw new Error("Tried to access back-end feature in front-end."); },
      detectMetadataForCluster: () => { throw new Error("Tried to access back-end feature in front-end."); },
      detectSpecificMetadataForCluster: () => { throw new Error("Tried to access back-end feature in front-end."); },
      emitClusterState: () => { throw new Error("Tried to access back-end feature in front-end."); },
      emitConnectionUpdate: () => { throw new Error("Tried to access back-end feature in front-end."); },
      emitListNamespacesForbidden: () => { throw new Error("Tried to access back-end feature in front-end."); },
    };

    return (model) => new Cluster(dependencies, model);
  },

  injectionToken: createClusterInjectionToken,

  lifecycle: lifecycleEnum.singleton,
});

export default createClusterInjectable;
