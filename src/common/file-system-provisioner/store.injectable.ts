/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { FileSystemProvisionerStore } from "./store";
import fileSystemProvisionerStoreLoggerInjectable from "./logger.injectable";
import directoryForExtensionDataInjectable from "../paths/extension-data.injectable";
import directoryForUserDataInjectable from "../paths/user-data.injectable";

const fileSystemProvisionerStoreInjectable = getInjectable({
  instantiate: (di) => new FileSystemProvisionerStore(
    {
      directoryForExtensionData: di.inject(directoryForExtensionDataInjectable),
      logger: di.inject(fileSystemProvisionerStoreLoggerInjectable),
      userDataPath: di.inject(directoryForUserDataInjectable),
    },
    {},
  ),
  lifecycle: lifecycleEnum.singleton,
});

export default fileSystemProvisionerStoreInjectable;
