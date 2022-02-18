/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { IComputedValue } from "mobx";
import enabledInstancesInjectable from "../common/extensions/enabled-instances.injectable";
import type { LensRendererExtension } from "./lens-renderer-extension";

const rendererExtensionsInjectable = getInjectable({
  instantiate: (di) => di.inject(enabledInstancesInjectable) as IComputedValue<LensRendererExtension[]>,
  lifecycle: lifecycleEnum.singleton,
});

export default rendererExtensionsInjectable;
