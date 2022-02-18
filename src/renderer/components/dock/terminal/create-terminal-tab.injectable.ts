/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import dockStoreInjectable from "../dock/store.injectable";
import { DockTabCreateOption, TabKind } from "../dock/store";

const createTerminalTabInjectable = getInjectable({
  instantiate: (di) => {
    const dockStore = di.inject(dockStoreInjectable);

    return (tabParams: DockTabCreateOption = {}) =>
      dockStore.createTab({
        title: `Terminal`,
        ...tabParams,
        kind: TabKind.TERMINAL,
      });
  },

  lifecycle: lifecycleEnum.singleton,
});

export default createTerminalTabInjectable;
