/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ClusterId } from "../cluster-types";
import type { ClusterStore } from "./cluster-store";
import { clusterStoreInjectionToken } from "./cluster-store-injection-token";

export type DeleteClusterById = (id: ClusterId) => void;

interface Dependencies {
  store: ClusterStore;
}

const deleteClusterById = ({ store }: Dependencies): DeleteClusterById => (
  (id) => store.deleteById(id)
);

const deleteClusterByIdInjectable = getInjectable({
  instantiate: (di) => deleteClusterById({
    store: di.inject(clusterStoreInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default deleteClusterByIdInjectable;
