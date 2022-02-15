/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { Cluster, ClusterDependencies } from "../../common/cluster/cluster";
import directoryForKubeConfigsInjectable from "../../common/directory-path/local-kube-configs.injectable";
import createKubeconfigManagerInjectable from "../kubeconfig-manager/create-kubeconfig-manager.injectable";
import createKubectlInjectable from "../kubectl/create-kubectl.injectable";
import createContextHandlerInjectable from "../context-handler/create-context-handler.injectable";
import { createClusterInjectionToken } from "../../common/cluster/create-cluster-injection-token";
import authorizationReviewInjectable from "../../common/cluster/authorization-review.injectable";
import listNamespacesInjectable from "../../common/cluster/list-namespaces.injectable";
import detectSpecificMetadataForClusterInjectable from "../cluster-metadata/detect-specific-for-cluster.injectable";
import detectMetadataForClusterInjectable from "../cluster-metadata/detect-for-cluster.injectable";
import emitListNamespacesForbiddenInjectable from "../../common/ipc/cluster/list-namespaces/emit.injectable";

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
    };

    return (model) => new Cluster(dependencies, model);
  },

  injectionToken: createClusterInjectionToken,

  lifecycle: lifecycleEnum.singleton,
});

export default createClusterInjectable;
