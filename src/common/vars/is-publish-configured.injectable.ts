/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { build } from "../../../package.json";

const isPublishConfiguredInjectable = getInjectable({
  instantiate: () => Object.keys(build).includes("publish"),
  lifecycle: lifecycleEnum.singleton,
});

export default isPublishConfiguredInjectable;
