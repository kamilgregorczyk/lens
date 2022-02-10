/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import emitCanGoBackInjectable from "../../../common/ipc/history/can-go-back/emit.injectable";
import emitCanGoForwardInjectable from "../../../common/ipc/history/can-go-forward/emit.injectable";
import { windowLocationChangedInjectionToken } from "../../../common/ipc/window/location-changed.token";
import getAllWebContentsInjectable from "../../window/get-all-web-contents.injectable";
import { implWithOn } from "../impl-with-on";

const windowLocationChangedInjectable = implWithOn(windowLocationChangedInjectionToken, (di) => {
  const getAllWebContents = di.inject(getAllWebContentsInjectable);
  const emitCanGoBack = di.inject(emitCanGoBackInjectable);
  const emitCanGoForward = di.inject(emitCanGoForwardInjectable);

  return () => {
    let canGoBack = false;
    let canGoForward = false;

    for (const content of getAllWebContents()) {
      if (content.getType() === "window") {
        canGoBack ||= content.canGoBack();
        canGoForward ||= content.canGoForward();
      }
    }

    emitCanGoBack(canGoBack);
    emitCanGoForward(canGoForward);
  };
});

export default windowLocationChangedInjectable;
