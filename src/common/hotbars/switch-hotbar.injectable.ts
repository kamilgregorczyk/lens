/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { HotbarStore, OrderDirection } from "./store";
import { hotbarStoreInjectionToken } from "./store-injection-token";

export type SwitchHotbar = (direction: OrderDirection) => void;

interface Dependencies {
  store: HotbarStore;
}

const switchHotbar = ({ store }: Dependencies): SwitchHotbar => (
  (direction) => store.switchHotbar(direction)
);

const switchHotbarInjectable = getInjectable({
  instantiate: (di) => switchHotbar({
    store: di.inject(hotbarStoreInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default switchHotbarInjectable;
