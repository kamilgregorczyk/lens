/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createChildLoggerInjectable from "../../../common/logger/create-child-logger.injectable";

const rootFrameLoggerInjectable = getInjectable({
  instantiate: (di) => {
    const createChildLogger = di.inject(createChildLoggerInjectable);

    return createChildLogger("ROOT-FRAME");
  },
  lifecycle: lifecycleEnum.singleton,
});

export default rootFrameLoggerInjectable;
