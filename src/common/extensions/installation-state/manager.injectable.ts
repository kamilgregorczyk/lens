/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import extensionInstallationStateManagerLoggerInjectable from "./logger.injectable";
import { ExtensionInstallationStateManager } from "./manager";

const extensionInstallationStateManagerInjectable = getInjectable({
  instantiate: (di) => new ExtensionInstallationStateManager({
    logger: di.inject(extensionInstallationStateManagerLoggerInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default extensionInstallationStateManagerInjectable;
