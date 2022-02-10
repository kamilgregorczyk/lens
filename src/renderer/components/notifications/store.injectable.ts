/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { NotificationsStore } from "./store";

const notificationsStoreInjectable = getInjectable({
  instantiate: () => new NotificationsStore(),
  lifecycle: lifecycleEnum.singleton,
});

export default notificationsStoreInjectable;
