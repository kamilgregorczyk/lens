/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ExtensionLoader } from "../../extensions/extension-loader";
import extensionLoaderInjectable from "../../extensions/extension-loader/extension-loader.injectable";
import type { LensRendererExtension } from "../../extensions/lens-renderer-extension";

export type GetExtensionById = (extId: string) => LensRendererExtension | undefined;

interface Dependencies {
  extensionLoader: ExtensionLoader;
}

const getExtensionById = ({ extensionLoader }: Dependencies): GetExtensionById => (
  (extId) => extensionLoader.getInstanceById(extId)
);

const getExtensionByIdInjectable = getInjectable({
  instantiate: (di) => getExtensionById({
    extensionLoader: di.inject(extensionLoaderInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getExtensionByIdInjectable;
