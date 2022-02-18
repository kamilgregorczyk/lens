/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { emitExtensionLoadedInjectionToken } from "../../common/ipc/extensions/loaded.token";

const emitExtensionLoadedInjectable = getInjectable({
  instantiate: () => (extId) => void extId,
  injectionToken: emitExtensionLoadedInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default emitExtensionLoadedInjectable;
