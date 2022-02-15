/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { HotbarStore } from "./store";

export type RemoveHotbar = (id: string) => void;

interface Dependencies {
  store: HotbarStore;
}

const removeHotbar = ({ store }: Dependencies): RemoveHotbar => (
  (id) => store.remove(id)
);

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { hotbarStoreInjectionToken } from "./store-injection-token";

const removeHotbarInjectable = getInjectable({
  instantiate: (di) => removeHotbar({
    store: di.inject(hotbarStoreInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default removeHotbarInjectable;

