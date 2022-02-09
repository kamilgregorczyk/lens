/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import directoryForExtensionDataInjectable from "../app-paths/directory-for-extension-data.injectable";
import directoryForUserDataInjectable from "../app-paths/directory-for-user-data.injectable";
import type { BaseStoreParams } from "../base-store";
import fileSystemProvisionerStoreLoggerInjectable from "./logger.injectable";
import { FileSystemProvisionerModel, FileSystemProvisionerStore, FileSystemProvisionerStoreDependencies } from "./store";

const createFileSystemProvisionerStoreInjectable = getInjectable({
  instantiate: (di) => {
    const deps: FileSystemProvisionerStoreDependencies = {
      directoryForExtensionData: di.inject(directoryForExtensionDataInjectable),
      logger: di.inject(fileSystemProvisionerStoreLoggerInjectable),
      userDataPath: di.inject(directoryForUserDataInjectable),
    };

    return (params: BaseStoreParams<FileSystemProvisionerModel>) => new FileSystemProvisionerStore(deps, params);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default createFileSystemProvisionerStoreInjectable;
