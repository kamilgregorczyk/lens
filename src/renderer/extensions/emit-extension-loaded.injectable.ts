/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { emitExtensionLoadedInjectionToken } from "../../common/ipc/extensions/loaded.token";
import extensionLoadedInjectable from "../ipc/extensions/loaded.injectable";

const emitExtensionLoadedInjectable = getInjectable({
  instantiate: (di) => di.inject(extensionLoadedInjectable),
  injectionToken: emitExtensionLoadedInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default emitExtensionLoadedInjectable;
