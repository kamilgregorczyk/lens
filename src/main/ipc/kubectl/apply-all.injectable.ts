/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import appEventBusInjectable from "../../../common/app-event-bus/app-event-bus.injectable";
import getClusterByIdInjectable from "../../../common/clusters/get-by-id.injectable";
import { kubectlApplyAllInjectionToken } from "../../../common/ipc/kubectl/apply-all.token";
import { ResourceApplier } from "../../resource-applier";
import { implWithHandle } from "../impl-with-handle";

const kubectlApplyAllInjectable = implWithHandle(kubectlApplyAllInjectionToken, (di) => {
  const appEventBus = di.inject(appEventBusInjectable);
  const getClusterById = di.inject(getClusterByIdInjectable);

  return async (clusterId, resources, extraArgs) => {
    appEventBus.emit({ name: "cluster", action: "kubectl-apply-all" });
    const cluster = getClusterById(clusterId);

    if (cluster) {
      const applier = new ResourceApplier(cluster);

      try {
        const stdout = await applier.kubectlApplyAll(resources, extraArgs);

        return { stdout };
      } catch (error) {
        return { stderr: String(error) };
      }
    } else {
      throw `${clusterId} is not a valid cluster id`;
    }
  };
});

export default kubectlApplyAllInjectable;
