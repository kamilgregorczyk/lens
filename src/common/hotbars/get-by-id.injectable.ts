/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { Hotbar } from "./hotbar";
import type { HotbarStore } from "./store";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { hotbarStoreInjectionToken } from "./store-injection-token";

export type GetHotbarById = (id: string) => Hotbar | undefined;

interface Dependencies {
  store: HotbarStore;
}

const getHotbarById = ({ store }: Dependencies): GetHotbarById => (
  (id) => store.getById(id)
);

const getHotbarByIdInjectable = getInjectable({
  instantiate: (di) => getHotbarById({
    store: di.inject(hotbarStoreInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getHotbarByIdInjectable;

