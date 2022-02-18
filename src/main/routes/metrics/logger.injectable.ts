/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createChildLoggerInjectable from "../../../common/logger/create-child-logger.injectable";

const metricsRouteLoggerInjectable = getInjectable({
  instantiate: (di) => {
    const createChildLogger = di.inject(createChildLoggerInjectable);

    return createChildLogger("METRICS-ROUTE");
  },
  lifecycle: lifecycleEnum.singleton,
});

export default metricsRouteLoggerInjectable;
