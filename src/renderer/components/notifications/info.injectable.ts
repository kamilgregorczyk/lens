/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { Disposer } from "../../utils";
import { NotificationKind, NotificationMessage, NotificationsStore, SpecificNotifcationCreateArgs } from "./store";
import notificationsStoreInjectable from "./store.injectable";

export type InfoNotification = (message: NotificationMessage, customOpts?: SpecificNotifcationCreateArgs) => Disposer;

interface Dependencies {
  store: NotificationsStore;
}

const infoNotification = ({ store }: Dependencies): InfoNotification => (
  (message, customOpts) => store.add({
    ...customOpts ?? {},
    kind: NotificationKind.INFO,
    message,
  })
);

const infoNotificationInjectable = getInjectable({
  instantiate: (di) => infoNotification({
    store: di.inject(notificationsStoreInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default infoNotificationInjectable;
