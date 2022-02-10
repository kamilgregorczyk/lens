/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import appEventBusInjectable from "../../../common/app-event-bus/app-event-bus.injectable";
import getClusterByIdInjectable from "../../../common/cluster-store/get-cluster-by-id.injectable";
import { kubectlDeleteAllInjectionToken } from "../../../common/ipc/kubectl/delete-all.token";
import { ResourceApplier } from "../../resource-applier";
import { implWithHandle } from "../impl-with-handle";

const kubectlDeleteAllInjectable = implWithHandle(kubectlDeleteAllInjectionToken, (di) => {
  const appEventBus = di.inject(appEventBusInjectable);
  const getClusterById = di.inject(getClusterByIdInjectable);

  return async (clusterId, resources, extraArgs) => {
    appEventBus.emit({ name: "cluster", action: "kubectl-delete-all" });
    const cluster = getClusterById(clusterId);

    if (cluster) {
      const applier = new ResourceApplier(cluster);

      try {
        const stdout = await applier.kubectlDeleteAll(resources, extraArgs);

        return { stdout };
      } catch (error) {
        return { stderr: String(error) };
      }
    } else {
      throw `${clusterId} is not a valid cluster id`;
    }
  };
});

export default kubectlDeleteAllInjectable;
