/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { HotbarStore } from "./store";
import { hotbarStoreInjectionToken } from "./store-injection-token";

export type SetActiveHotbar = (id: string) => void;

interface Dependencies {
  store: HotbarStore;
}

const setActiveHotbar = ({ store }: Dependencies): SetActiveHotbar => (
  (id) => store.setActiveHotbar(id)
);

const setActiveHotbarInjectable = getInjectable({
  instantiate: (di) => setActiveHotbar({
    store: di.inject(hotbarStoreInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default setActiveHotbarInjectable;
