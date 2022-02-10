/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { clusterStoreInjectionToken } from "../../common/clusters/store-injection-token";
import versionedMigrationsInjectable from "./migrations/versioned.injectable";
import createClusterStoreInjectable from "../../common/clusters/create-store.injectable";
import { reaction } from "mobx";

const clusterStoreInjectable = getInjectable({
  instantiate: (di) => {
    const createClusterStore = di.inject(createClusterStoreInjectable);
    const store = createClusterStore({
      migrations: di.inject(versionedMigrationsInjectable),
    });

    // TODO: remove state sync that isn't part of the catalog
    reaction(
      () => store.connectedClustersList,
      (clusters) => {
        for (const cluster of clusters) {
          cluster.pushState();
        }
      },
    );

    return store;
  },
  injectionToken: clusterStoreInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default clusterStoreInjectable;
