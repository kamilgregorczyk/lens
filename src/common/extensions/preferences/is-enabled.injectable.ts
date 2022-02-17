/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ExtensionsPreferencesStore } from "./store";
import { extensionsPreferencesStoreInjectionToken } from "./store-injection-token";

export type IsExtensionEnabled = (extId: string, isBundled: boolean) => boolean;

interface Dependencies {
  store: ExtensionsPreferencesStore;
}

const isExtensionEnabled = ({ store }: Dependencies): IsExtensionEnabled => (
  (extId, isBundled) => store.isEnabled(extId, isBundled)
);

const isExtensionEnabledInjectable = getInjectable({
  instantiate: (di) => isExtensionEnabled({
    store: di.inject(extensionsPreferencesStoreInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default isExtensionEnabledInjectable;
