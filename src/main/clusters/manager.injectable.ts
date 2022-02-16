/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import getEntitiesByClassInjectable from "../../common/catalog/entity/get-by-class.injectable";
import getEntityByIdInjectable from "../../common/catalog/entity/get-by-id.injectable";
import { ClusterManager } from "./manager";
import clusterManagerLoggerInjectable from "./manager-logger.injectable";
import clusterStoreInjectable from "./store.injectable";

const clusterManagerInjectable = getInjectable({
  instantiate: (di) => new ClusterManager({
    store: di.inject(clusterStoreInjectable),
    getEntitiesByClass: di.inject(getEntitiesByClassInjectable),
    getEntityById: di.inject(getEntityByIdInjectable),
    logger: di.inject(clusterManagerLoggerInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default clusterManagerInjectable;
