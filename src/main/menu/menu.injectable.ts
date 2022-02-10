/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { Menu } from "electron";
import { computed, IComputedValue } from "mobx";
import type { WindowManager } from "../window/manager";
import windowManagerInjectable from "../window/manager.injectable";
import electronMenuItemsInjectable from "./electron-menu-items.injectable";
import { buildMenu } from "./build-menu";
import type { MenuRegistration } from "./menu-registration";

interface Dependencies {
  windowManager: WindowManager;
  electronMenuItems: IComputedValue<MenuRegistration[]>;
}

function computeMenu({ windowManager, electronMenuItems }: Dependencies) {
  return computed(() => Menu.buildFromTemplate(buildMenu(windowManager, electronMenuItems.get())));
}

const menuInjectable = getInjectable({
  instantiate: (di) => computeMenu({
    electronMenuItems: di.inject(electronMenuItemsInjectable),
    windowManager: di.inject(windowManagerInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default menuInjectable;
