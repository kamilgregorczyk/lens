/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { requestUninstallExtensionInjectionToken } from "../../../common/ipc/extensions/uninstall.token";
import uninstallExtensionInjectable from "../../extensions/discovery/uninstall-extension.injectable";
import { implWithHandle } from "../impl-channel";

const handleUninstallExtensionInjectable = implWithHandle(requestUninstallExtensionInjectionToken, (di) => {
  const uninstallExtension = di.inject(uninstallExtensionInjectable);

  return (extId) => uninstallExtension(extId);
});

export default handleUninstallExtensionInjectable;
