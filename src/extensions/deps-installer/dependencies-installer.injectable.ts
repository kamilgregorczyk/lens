/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import directoryForUserDataInjectable from "../../common/paths/user-data.injectable";
import { ExtensionInstaller } from "./dependencies-installer";
import extensionDependenciesInstallerLoggerInjectable from "./logger.injectable";

const extensionInstallerInjectable = getInjectable({
  instantiate: (di) => new ExtensionInstaller({
    directoryForUserDataInjectable: di.inject(directoryForUserDataInjectable),
    logger: di.inject(extensionDependenciesInstallerLoggerInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default extensionInstallerInjectable;
