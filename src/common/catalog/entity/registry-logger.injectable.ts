/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createChildLoggerInjectable from "../../logger/create-child-logger.injectable";

const catalogEntityRegistryLoggerInjectable = getInjectable({
  instantiate: (di) => {
    const createChildLogger = di.inject(createChildLoggerInjectable);

    return createChildLogger("CATALOG-ENTITY-REGISTRY");
  },
  lifecycle: lifecycleEnum.singleton,
});

export default catalogEntityRegistryLoggerInjectable;
