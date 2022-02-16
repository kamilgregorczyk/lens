/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createChildLoggerInjectable from "../logger/create-child-logger.injectable";

const clusterLoggerInjectable = getInjectable({
  instantiate: (di) => {
    const createChildLogger = di.inject(createChildLoggerInjectable);

    return createChildLogger("CLUSTER");
  },
  lifecycle: lifecycleEnum.singleton,
});

export default clusterLoggerInjectable;
