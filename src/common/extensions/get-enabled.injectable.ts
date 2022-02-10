/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ExtensionsStore } from "./store";
import { extensionsStoreInjectionToken } from "./store-injection-token";

interface Dependencies {
  store: ExtensionsStore;
}

const getEnabledExtensions = ({ store }: Dependencies) => (
  () => store.enabledExtensions.get()
);

const getEnabledExtensionsInjectable = getInjectable({
  instantiate: (di) => getEnabledExtensions({
    store: di.inject(extensionsStoreInjectionToken),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default getEnabledExtensionsInjectable;
