/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed, IComputedValue, ObservableMap } from "mobx";
import childLoggersInjectable from "./child-loggers-state.injectable";

export type ClaimChildLogger = (prefix: string) => IComputedValue<boolean>;

interface Dependencies {
  state: ObservableMap<string, boolean>;
}

const claimChildLogger = ({ state }: Dependencies): ClaimChildLogger => (
  (prefix) => {
    if (state.has(prefix)) {
      throw new Error(`Child logging prefix "${prefix}" has already been claimed`);
    }

    state.set(prefix, false);

    return computed(() => state.get(prefix));
  }
);

const claimChildLoggerInjectable = getInjectable({
  instantiate: (di) => claimChildLogger({
    state: di.inject(childLoggersInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default claimChildLoggerInjectable;
