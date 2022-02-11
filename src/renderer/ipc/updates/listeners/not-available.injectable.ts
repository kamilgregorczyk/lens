/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { emitUpdateNotAvailableInjectionToken, UpdateNotAvailable } from "../../../../common/ipc/updates/not-available/emit.token";
import type { ShortInfoNotification } from "../../../components/notifications/short-info.injectable";
import shortInfoNotificationInjectable from "../../../components/notifications/short-info.injectable";
import { setupListener } from "../../setup-listener";

interface Dependencies {
  shortInfoNotification: ShortInfoNotification;
}

const listener = ({ shortInfoNotification }: Dependencies): UpdateNotAvailable => (
  () => {
    shortInfoNotification("No update is currently available");
  }
);

const initUpdateNotAvailableListenerInjectable = getInjectable({
  instantiate: (di) => () => {
    setupListener(di, emitUpdateNotAvailableInjectionToken, listener({
      shortInfoNotification: di.inject(shortInfoNotificationInjectable),
    }));
  },
  lifecycle: lifecycleEnum.singleton,
});

export default initUpdateNotAvailableListenerInjectable;
