/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed } from "mobx";
import childLoggersInjectable from "./child-loggers-state.injectable";

const claimChildLoggerInjectable = getInjectable({
  instantiate: (di) => {
    const state = di.inject(childLoggersInjectable);

    return (prefix: string) => {
      if (state.has(prefix)) {
        throw new Error(`Child logging prefix "${prefix}" has already been claimed`);
      }

      state.set(prefix, false);

      return computed(() => state.get(prefix));
    };
  },
  lifecycle: lifecycleEnum.singleton,
});

export default claimChildLoggerInjectable;
