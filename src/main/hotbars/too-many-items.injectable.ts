/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { onTooManyHotbarItemsInjectionToken } from "../../common/hotbars/too-many-items.token";
import { noop } from "../../common/utils";

const onTooManyHotbarItemsInjectable = getInjectable({
  instantiate: () => noop,
  injectionToken: onTooManyHotbarItemsInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default onTooManyHotbarItemsInjectable;
