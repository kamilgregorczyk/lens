/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { observable, ObservableMap } from "mobx";
import type { LensExtensionId, LensExtensionManifest } from "../../extensions/lens-extension";

export interface InstalledExtension {
  readonly id: LensExtensionId;

  readonly manifest: LensExtensionManifest;

  // Absolute path to the non-symlinked source folder,
  // e.g. "/Users/user/.k8slens/extensions/helloworld"
  readonly absolutePath: string;

  // Absolute to the symlinked package.json file
  readonly manifestPath: string;
  readonly isBundled: boolean; // defined in project root's package.json
  readonly isCompatible: boolean;
}

export type InstalledExtensions = ObservableMap<LensExtensionId, InstalledExtension>;

const installedExtensionsInjectable = getInjectable({
  instantiate: (): InstalledExtensions => observable.map(),
  lifecycle: lifecycleEnum.singleton,
});

export default installedExtensionsInjectable;
