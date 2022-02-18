/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { LensRendererExtension } from "../../extensions/lens-renderer-extension";
import type { ExtensionInstances } from "../../common/extensions/instances.injectable";
import extensionInstancesInjectable from "../../common/extensions/instances.injectable";

export type GetExtensionById = (extId: string) => LensRendererExtension | undefined;

interface Dependencies {
  state: ExtensionInstances;
}

const getExtensionById = ({ state }: Dependencies): GetExtensionById => (
  (extId) => state.get(extId) as LensRendererExtension
);

const getExtensionByIdInjectable = getInjectable({
  instantiate: (di) => getExtensionById({
    state: di.inject(extensionInstancesInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getExtensionByIdInjectable;
