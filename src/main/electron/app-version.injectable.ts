/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import electronAppInjectable from "./app.injectable";

const appVersionInjectable = getInjectable({
  instantiate: (di) => di.inject(electronAppInjectable).getVersion(),
  lifecycle: lifecycleEnum.singleton,
});

export default appVersionInjectable;
