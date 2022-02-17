/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ExtensionsPreferencesStore, LensExtensionState } from "./store";
import { extensionsPreferencesStoreInjectionToken } from "./store-injection-token";
import type { LensExtensionId } from "../../../extensions/lens-extension";

interface Dependencies {
  store: ExtensionsPreferencesStore;
}

export type UpdateExtensionsState = (partialNewState: Partial<Record<LensExtensionId, LensExtensionState>>) => void;

const updateExtensionsState = ({ store }: Dependencies): UpdateExtensionsState => (
  (partialNewState) => store.mergeState(partialNewState)
);

const updateExtensionsStateInjectable = getInjectable({
  instantiate: (di) => updateExtensionsState({
    store: di.inject(extensionsPreferencesStoreInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default updateExtensionsStateInjectable;
