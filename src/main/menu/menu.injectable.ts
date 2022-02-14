/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { Menu } from "electron";
import { computed, IComputedValue } from "mobx";
import menuTemplateInjectable, { MenuItemsOpts } from "./menu-template.injectable";

interface Dependencies {
  menuTemplate: IComputedValue<MenuItemsOpts[]>;
}

function computeMenu({ menuTemplate }: Dependencies) {
  return computed(() => Menu.buildFromTemplate(menuTemplate.get()));
}

const menuInjectable = getInjectable({
  instantiate: (di) => computeMenu({
    menuTemplate: di.inject(menuTemplateInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default menuInjectable;
