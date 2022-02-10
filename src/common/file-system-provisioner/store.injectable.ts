/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { FileSystemProvisionerStore } from "./store";
import fileSystemProvisionerStoreLoggerInjectable from "./logger.injectable";
import directoryForExtensionDataInjectable from "../directory-path/extension-data.injectable";

const fileSystemProvisionerStoreInjectable = getInjectable({
  instantiate: (di) => new FileSystemProvisionerStore(
    {
      directoryForExtensionData: di.inject(directoryForExtensionDataInjectable),
      logger: di.inject(fileSystemProvisionerStoreLoggerInjectable),
    },
    {},
  ),
  lifecycle: lifecycleEnum.singleton,
});

export default fileSystemProvisionerStoreInjectable;
