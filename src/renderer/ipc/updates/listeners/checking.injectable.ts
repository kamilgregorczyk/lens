/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { CheckingForUpdates, emitCheckingForUpdatesInjectionToken } from "../../../../common/ipc/updates/checking/emit.token";
import shortInfoNotificationInjectable, { ShortInfoNotification } from "../../../components/notifications/short-info.injectable";
import { setupListener } from "../../setup-listener";

interface Dependencies {
  shortInfoNotification: ShortInfoNotification;
}

const listener = ({ shortInfoNotification }: Dependencies): CheckingForUpdates => (
  () => {
    shortInfoNotification("Checking for updates");
  }
);

const initUpdateCheckingListenerInjectable = getInjectable({
  instantiate: (di) => () => {
    setupListener(di, emitCheckingForUpdatesInjectionToken, listener({
      shortInfoNotification: di.inject(shortInfoNotificationInjectable),
    }));
  },
  lifecycle: lifecycleEnum.singleton,
});

export default initUpdateCheckingListenerInjectable;
