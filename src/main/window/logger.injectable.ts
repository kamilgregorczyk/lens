/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createChildLoggerInjectable from "../../common/logger/create-child-logger.injectable";

const windowManagerLoggerInjectable = getInjectable({
  instantiate: (di) => {
    const createChildLogger = di.inject(createChildLoggerInjectable);

    return createChildLogger("WINDOW-MANAGER");
  },
  lifecycle: lifecycleEnum.singleton,
});

export default windowManagerLoggerInjectable;
