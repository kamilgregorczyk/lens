/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createFileSystemProvisionerStoreInjectable from "../../common/file-system-provisioner/create-store.injectable";

const fileSystemProvisionerStoreInjectable = getInjectable({
  instantiate: (di) => {
    const createFileSystemProvisionerStore = di.inject(createFileSystemProvisionerStoreInjectable);

    return createFileSystemProvisionerStore({});
  },
  lifecycle: lifecycleEnum.singleton,
});

export default fileSystemProvisionerStoreInjectable;
