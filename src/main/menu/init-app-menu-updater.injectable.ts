/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { Menu } from "electron";
import { autorun, IComputedValue } from "mobx";
import menuInjectable from "./menu.injectable";

interface Dependencies {
  menu: IComputedValue<Menu>;
}

const initAppMenuUpdater = ({ menu }: Dependencies) => (
  () => (
    autorun(() => Menu.setApplicationMenu(menu.get()), {
      delay: 100,
    })
  )
);

const initAppMenuUpdaterInjectable = getInjectable({
  instantiate: (di) => initAppMenuUpdater({
    menu: di.inject(menuInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default initAppMenuUpdaterInjectable;
