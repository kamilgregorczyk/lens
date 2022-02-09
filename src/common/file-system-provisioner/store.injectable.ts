/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { FileSystemProvisionerStore } from "./file-system-provisioner-store";
import directoryForExtensionDataInjectable from "../../../../common/app-paths/directory-for-extension-data.injectable";

const fileSystemProvisionerStoreInjectable = getInjectable({
  instantiate: (di) =>
    FileSystemProvisionerStore.createInstance({
      directoryForExtensionData: di.inject(
        directoryForExtensionDataInjectable,
      ),
    }),

  lifecycle: lifecycleEnum.singleton,
});

export default fileSystemProvisionerStoreInjectable;
