/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { Hotbar } from "./hotbar";
import type { HotbarStore } from "./store";
import { hotbarStoreInjectionToken } from "./store-injection-token";

export type GetDisplayIndex = (hotbar: Hotbar) => string;

interface Dependencies {
  store: HotbarStore;
}

const getDisplayIndex = ({ store }:Dependencies): GetDisplayIndex => (
  (hotbar) => store.getDisplayIndex(hotbar)
);

const getDisplayIndexInjectable = getInjectable({
  instantiate: (di) => getDisplayIndex({
    store: di.inject(hotbarStoreInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getDisplayIndexInjectable;
