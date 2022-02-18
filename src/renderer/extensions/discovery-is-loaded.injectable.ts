/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { observable } from "mobx";

const isExtensionsInitiallyLoadedInjectable = getInjectable({
  instantiate: () => observable.box(false),
  lifecycle: lifecycleEnum.singleton,
});

export default isExtensionsInitiallyLoadedInjectable;
