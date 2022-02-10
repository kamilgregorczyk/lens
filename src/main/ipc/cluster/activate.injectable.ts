/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import getClusterByIdInjectable from "../../../common/clusters/get-by-id.injectable";
import { activateClusterInjectionToken } from "../../../common/ipc/cluster/activate.token";
import { implWithHandle } from "../impl-with-handle";

const activateClusterInjectable = implWithHandle(activateClusterInjectionToken, (di) => {
  const getClusterById = di.inject(getClusterByIdInjectable);

  return (id, force) => getClusterById(id)?.activate(force);
});

export default activateClusterInjectable;
