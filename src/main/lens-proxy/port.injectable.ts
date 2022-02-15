/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { observable } from "mobx";

export interface LensProxyPort {
  set: (port: number) => void;
  get: () => number;
}

const lensProxyPortInjectable = getInjectable({
  instantiate: (): LensProxyPort => {
    const state = observable.box<number | undefined>();

    return {
      set: (port) => {
        if (typeof state.get() === "number") {
          throw new Error("Cannot set proxy port more than once");
        }

        state.set(port);
      },
      get: () => state.get(),
    };
  },
  lifecycle: lifecycleEnum.singleton,
});

export default lensProxyPortInjectable;
