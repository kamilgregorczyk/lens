/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createChildLoggerInjectable from "../../common/logger/create-child-logger.injectable";

const lensProxyLoggerInjectable = getInjectable({
  instantiate: (di) => {
    const createChildLogger = di.inject(createChildLoggerInjectable);

    return createChildLogger("LENS-PROXY");
  },
  lifecycle: lifecycleEnum.singleton,
});

export default lensProxyLoggerInjectable;
