/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { emitWindowReloadPageInjectionToken } from "../../../../common/ipc/window/reload-page.token";
import { setupListener } from "../../setup-listener";

const listener = () => {
  location.reload();
};

const initReloadPageListenerInjectable = getInjectable({
  instantiate: (di) => () => {
    setupListener(di, emitWindowReloadPageInjectionToken, listener);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default initReloadPageListenerInjectable;
