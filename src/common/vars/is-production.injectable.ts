/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";

const isProductionInjectable = getInjectable({
  instantiate: () => process.env.NODE_ENV === "production",
  lifecycle: lifecycleEnum.singleton,
});

export default isProductionInjectable;
