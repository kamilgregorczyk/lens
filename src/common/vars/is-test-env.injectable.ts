/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { isTestEnv } from "../vars";

const isTestEnvInjectable = getInjectable({
  instantiate: () => isTestEnv,
  lifecycle: lifecycleEnum.singleton,
});

export default isTestEnvInjectable;
