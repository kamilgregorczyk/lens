/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { windowOpenAppContextMenuInjectionToken } from "../../../common/ipc/window/open-app-context-menu.token";
import menuInjectable from "../../menu/menu.injectable";
import getBrowserWindowByIdInjectable from "../../window/get-browser-window-by-id.injectable";
import { implWithRawOn } from "../impl-with-on";

const windowOpenAppContextMenuInjectable = implWithRawOn(windowOpenAppContextMenuInjectionToken, (di) => {
  const getBrowserWindowById = di.inject(getBrowserWindowByIdInjectable);
  const menu = di.inject(menuInjectable);

  return (event) => {
    const window = getBrowserWindowById(event.sender.id);

    menu.get().popup({
      window,
      // Center of the topbar menu icon
      x: 20,
      y: 20,
    });
  };
});

export default windowOpenAppContextMenuInjectable;
