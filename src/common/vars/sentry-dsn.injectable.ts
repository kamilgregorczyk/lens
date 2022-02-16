/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { config } from "../../../package.json";

const sentryDsnInjectable = getInjectable({
  instantiate: () => config.sentryDsn,
  lifecycle: lifecycleEnum.singleton,
});

export default sentryDsnInjectable;
