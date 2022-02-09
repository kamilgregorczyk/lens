/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createChildLoggerInjectable from "../logger/create-child-logger.injectable";

const hotbarStoreLoggerInjectable = getInjectable({
  instantiate: (di) => {
    const createChildLogger = di.inject(createChildLoggerInjectable);

    return createChildLogger("HOTBAR-STORE");
  },
  lifecycle: lifecycleEnum.singleton,
});

export default hotbarStoreLoggerInjectable;
