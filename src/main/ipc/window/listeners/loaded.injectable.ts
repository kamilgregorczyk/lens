/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { emitWindowLoadedInjectionToken } from "../../../../common/ipc/window/loaded.token";
import lensProtocolRouterMainInjectable from "../../../protocol-handler/router.injectable";
import { implWithOn } from "../../impl-channel";

const windowLoadedListenerInjectable = implWithOn(emitWindowLoadedInjectionToken, (di) => {
  const router = di.inject(lensProtocolRouterMainInjectable);

  return () => router.rendererLoaded = true;
});

export default windowLoadedListenerInjectable;
