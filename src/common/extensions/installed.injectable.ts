/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { observable, ObservableMap } from "mobx";
import type { InstalledExtension } from "../../extensions/discovery/discovery";
import type { LensExtensionId } from "../../extensions/lens-extension";

export type InstalledExtensions = ObservableMap<LensExtensionId, InstalledExtension>;

const installedExtensionsInjectable = getInjectable({
  instantiate: (): InstalledExtensions => observable.map(),
  lifecycle: lifecycleEnum.singleton,
});

export default installedExtensionsInjectable;
