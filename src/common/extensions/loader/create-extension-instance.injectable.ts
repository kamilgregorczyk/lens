/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { InstalledExtension } from "../installed.injectable";
import requestDirectoryInjectable from "../../file-system-provisioner/request-directory.injectable";
import type { LensExtension, LensExtensionConstructor } from "../../../extensions/lens-extension";
import { extensionDependencies, LensExtensionDependencies } from "../../../extensions/lens-extension-set-dependencies";
import extensionsLoaderLoggerInjectable from "./logger.injectable";

export type CreateExtensionInstance = (ExtensionClass: LensExtensionConstructor, extension: InstalledExtension) => LensExtension;

const createExtensionInstance = (dependencies: LensExtensionDependencies): CreateExtensionInstance => (
  (ExtensionClass: LensExtensionConstructor, extension: InstalledExtension) => {
    const instance = new ExtensionClass(extension);

    instance[extensionDependencies] = dependencies;

    return instance;
  }
);

const createExtensionInstanceInjectable = getInjectable({
  instantiate: (di) => createExtensionInstance({
    requestDirectory: di.inject(requestDirectoryInjectable),
    logger: di.inject(extensionsLoaderLoggerInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default createExtensionInstanceInjectable;
