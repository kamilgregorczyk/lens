/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import requestDirectoryInjectable from "../../common/file-system-provisioner/request-directory.injectable";
import type { LensExtensionConstructor } from "../lens-extension";
import type { InstalledExtension } from "../extension-discovery/extension-discovery";
import { LensExtensionDependencies, setLensExtensionDependencies } from "../lens-extension-set-dependencies";

const createExtensionInstance = (dependencies: LensExtensionDependencies) => (
  (ExtensionClass: LensExtensionConstructor, extension: InstalledExtension) => {
    const instance = new ExtensionClass(extension);

    instance[setLensExtensionDependencies](dependencies);

    return instance;
  }
);

const createExtensionInstanceInjectable = getInjectable({
  instantiate: (di) => createExtensionInstance({
    requestDirectory: di.inject(requestDirectoryInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default createExtensionInstanceInjectable;
