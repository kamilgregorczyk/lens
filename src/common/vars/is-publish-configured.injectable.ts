/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { isPublishConfigured } from "../vars";

const isPublishConfiguredInjectable = getInjectable({
  instantiate: () => isPublishConfigured,
  lifecycle: lifecycleEnum.singleton,
});

export default isPublishConfiguredInjectable;
