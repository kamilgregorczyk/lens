/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { IComputedValue } from "mobx";
import enabledInstancesInjectable from "../common/extensions/enabled-instances.injectable";
import type { LensMainExtension } from "./lens-main-extension";

const mainExtensionsInjectable = getInjectable({
  lifecycle: lifecycleEnum.singleton,

  instantiate: (di) => di.inject(enabledInstancesInjectable) as IComputedValue<LensMainExtension[]>,
});

export default mainExtensionsInjectable;
