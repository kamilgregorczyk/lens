/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { iter } from "../utils";
import extensionInstancesInjectable from "./instances.injectable";

const enabledInstancesInjectable = getInjectable({
  instantiate: (di) => {
    const instances = di.inject(extensionInstancesInjectable);

    return computed(() => Array.from(iter.filter(instances.values(), instance => instance.isEnabled)));
  },

  lifecycle: lifecycleEnum.singleton,
});

export default enabledInstancesInjectable;
