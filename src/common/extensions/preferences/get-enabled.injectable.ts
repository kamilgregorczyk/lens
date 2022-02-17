/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ExtensionsPreferencesStore } from "./store";
import { extensionsPreferencesStoreInjectionToken } from "./store-injection-token";

interface Dependencies {
  store: ExtensionsPreferencesStore;
}

const getEnabledExtensions = ({ store }: Dependencies) => (
  () => store.enabledExtensions.get()
);

const getEnabledExtensionsInjectable = getInjectable({
  instantiate: (di) => getEnabledExtensions({
    store: di.inject(extensionsPreferencesStoreInjectionToken),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default getEnabledExtensionsInjectable;
