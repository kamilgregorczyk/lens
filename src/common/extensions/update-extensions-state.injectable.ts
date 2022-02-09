/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ExtensionsStore, LensExtensionState } from "./store";
import { extensionsStoreInjectionToken } from "./store-injection-token";
import type { LensExtensionId } from "../../extensions/lens-extension";

interface Dependencies {
  store: ExtensionsStore;
}

export type UpdateExtensionsState = (partialNewState: Partial<Record<LensExtensionId, LensExtensionState>>) => void;

const updateExtensionsState = ({ store }: Dependencies): UpdateExtensionsState => (
  (partialNewState) => store.mergeState(partialNewState)
);

const updateExtensionsStateInjectable = getInjectable({
  instantiate: (di) => updateExtensionsState({
    store: di.inject(extensionsStoreInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default updateExtensionsStateInjectable;
