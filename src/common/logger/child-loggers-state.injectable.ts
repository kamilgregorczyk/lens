/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { observable } from "mobx";

const childLoggersInjectable = getInjectable({
  instantiate: () => observable.map<string, boolean>(), // Whether debug logging is enabled for child loggers
  lifecycle: lifecycleEnum.singleton,
});

export default childLoggersInjectable;
