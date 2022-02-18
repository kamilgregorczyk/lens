/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { InstalledExtension } from "../installed.injectable";
import type { ExtensionsPreferencesStore } from "./store";
import { extensionsPreferencesStoreInjectionToken } from "./store-injection-token";

export type IsExtensionEnabled = (extension: Pick<InstalledExtension, "id" | "isBundled">) => boolean;

interface Dependencies {
  store: ExtensionsPreferencesStore;
}

const isExtensionEnabled = ({ store }: Dependencies): IsExtensionEnabled => (
  (extension) => store.isEnabled(extension)
);

const isExtensionEnabledInjectable = getInjectable({
  instantiate: (di) => isExtensionEnabled({
    store: di.inject(extensionsPreferencesStoreInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default isExtensionEnabledInjectable;
