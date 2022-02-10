/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { NotificationsStore } from "./store";
import notificationsStoreInjectable from "./store.injectable";

export type HasNotificationById = (id: string) => boolean;

interface Dependencies {
  store: NotificationsStore;
}

const hasNotificationById = ({ store }: Dependencies): HasNotificationById => (
  (id) => store.hasById(id)
);

const hasNotificationByIdInjectable = getInjectable({
  instantiate: (di) => hasNotificationById({
    store: di.inject(notificationsStoreInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default hasNotificationByIdInjectable;
