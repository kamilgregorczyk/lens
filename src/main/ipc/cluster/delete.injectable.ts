/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import path from "path";
import directoryForLensLocalStorageInjectable from "../../../common/directory-path/local-storage.injectable";
import deleteClusterByIdInjectable from "../../../common/clusters/delete-by-id.injectable";
import getClusterByIdInjectable from "../../../common/clusters/get-by-id.injectable";
import removeInjectable from "../../../common/fs/remove.injectable";
import { deleteClusterInjectionToken } from "../../../common/ipc/cluster/delete.token";
import clusterFramesInjectable from "../../clusters/frames.injectable";
import { implWithHandle } from "../impl-with-handle";

const deleteClusterInjectable = implWithHandle(deleteClusterInjectionToken, (di) => {
  const getClusterById = di.inject(getClusterByIdInjectable);
  const deleteClusterById = di.inject(deleteClusterByIdInjectable);
  const clusterFrames = di.inject(clusterFramesInjectable);
  const remove = di.inject(removeInjectable);
  const localStorage = di.inject(directoryForLensLocalStorageInjectable);

  return async (clusterId) => {
    const cluster = getClusterById(clusterId);

    if (!cluster) {
      return;
    }

    cluster.disconnect();
    clusterFrames.delete(cluster.id);

    // Remove from the cluster store as well, this should clear any old settings
    deleteClusterById(cluster.id);

    try {
      // remove the local storage file
      await remove(path.resolve(localStorage, `${cluster.id}.json`));
    } catch {
      // ignore error
    }
  };
});

export default deleteClusterInjectable;
