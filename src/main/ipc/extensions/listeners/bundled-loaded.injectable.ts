/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { bundledExtensionsLoadedInjectionToken } from "../../../../common/ipc/extensions/bundled-loaded.token";
import bundledExtensionsEventEmitterInjectable from "../../../extensions/bundled-loaded.injectable";
import { implWithOn } from "../../impl-channel";

const bundledExtensionsLoadedInjectable = implWithOn(bundledExtensionsLoadedInjectionToken, (di) => {
  const bundledExtensionsEmitter = di.inject(bundledExtensionsEventEmitterInjectable);

  return () => {
    bundledExtensionsEmitter.emit("loaded");
  };
});

export default bundledExtensionsLoadedInjectable;
