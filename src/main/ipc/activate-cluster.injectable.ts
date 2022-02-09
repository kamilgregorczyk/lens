/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import getClusterByIdInjectable from "../../common/cluster-store/get-cluster-by-id.injectable";
import { ActivateCluster, activateClusterChannel, activateClusterInjectionToken } from "../../common/ipc/activate-cluster-injection-token";
import handleInjectable from "./handle.injectable";

let activateCluster: ActivateCluster;

const activateClusterInjectable = getInjectable({
  setup: (di) => {
    const getClusterById = di.inject(getClusterByIdInjectable);
    const handle = di.inject(handleInjectable);

    handle(activateClusterChannel, activateCluster = (id, force) => getClusterById(id)?.activate(force));
  },
  instantiate: () => activateCluster,
  injectionToken: activateClusterInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default activateClusterInjectable;
