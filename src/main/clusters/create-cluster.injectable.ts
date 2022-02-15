/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { Cluster, ClusterDependencies } from "../../common/clusters/cluster";
import directoryForKubeConfigsInjectable from "../../common/directory-path/local-kube-configs.injectable";
import createKubeconfigManagerInjectable from "../kubeconfig-manager/create-kubeconfig-manager.injectable";
import createKubectlInjectable from "../kubectl/create-kubectl.injectable";
import createContextHandlerInjectable from "../context-handler/create-context-handler.injectable";
import { createClusterInjectionToken } from "../../common/clusters/create-cluster-injection-token";
import authorizationReviewInjectable from "../../common/clusters/authorization-review.injectable";
import listNamespacesInjectable from "../../common/clusters/list-namespaces.injectable";
import detectSpecificMetadataForClusterInjectable from "./metadata/detect-specific-for-cluster.injectable";
import detectMetadataForClusterInjectable from "./metadata/detect-for-cluster.injectable";
import emitListNamespacesForbiddenInjectable from "../../common/ipc/cluster/list-namespaces/emit.injectable";
import emitClusterConnectionStatusUpdateInjectable from "../ipc/cluster/connection-status.injectable";
import emitUpdateClusterStateInjectable from "../ipc/cluster/state.injectable";
import clusterLoggerInjectable from "../../common/clusters/cluster-logger.injectable";

const createClusterInjectable = getInjectable({
  instantiate: (di) => {
    const dependencies: ClusterDependencies = {
      directoryForKubeConfigs: di.inject(directoryForKubeConfigsInjectable),
      createKubeconfigManager: di.inject(createKubeconfigManagerInjectable),
      createKubectl: di.inject(createKubectlInjectable),
      createContextHandler: di.inject(createContextHandlerInjectable),
      createAuthorizationReview: di.inject(authorizationReviewInjectable),
      createListNamespaces: di.inject(listNamespacesInjectable),
      detectSpecificMetadataForCluster: di.inject(detectSpecificMetadataForClusterInjectable),
      detectMetadataForCluster: di.inject(detectMetadataForClusterInjectable),
      emitListNamespacesForbidden: di.inject(emitListNamespacesForbiddenInjectable),
      emitConnectionUpdate: di.inject(emitClusterConnectionStatusUpdateInjectable),
      emitClusterState: di.inject(emitUpdateClusterStateInjectable),
      logger: di.inject(clusterLoggerInjectable),
    };

    return (model) => new Cluster(dependencies, model);
  },

  injectionToken: createClusterInjectionToken,

  lifecycle: lifecycleEnum.singleton,
});

export default createClusterInjectable;
