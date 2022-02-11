/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, InjectionToken, lifecycleEnum } from "@ogre-tools/injectable";
import { emitNavigateExtensionInjectionToken } from "../../../common/ipc/window/navigate-extension.token";

const navigateExtensionInjectable = getInjectable({
  instantiate: (di) => {
    const sendToView = emitNavigateExtensionInjectionToken.getSendToView(di);

    return (extId, pageId, params, frameId) => sendToView([extId, pageId, params], frameId);
  },
  injectionToken: emitNavigateExtensionInjectionToken.token as unknown as InjectionToken<(extId: string, pageId?: string, params?: Record<string, any>, frameId?: number) => void, void>,
  lifecycle: lifecycleEnum.singleton,
});

export default navigateExtensionInjectable;
