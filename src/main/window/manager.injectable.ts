/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import appEventBusInjectable from "../../common/app-event-bus/app-event-bus.injectable";
import bundledExtensionsEventEmitterInjectable from "../extensions/bundled-loaded.injectable";
import lensProxyPortInjectable from "../lens-proxy/port.injectable";
import { WindowManager } from "./manager";

const windowManagerInjectable = getInjectable({
  instantiate: (di) => new WindowManager({
    appEventBus: di.inject(appEventBusInjectable),
    bundledExtensionsEmitter: di.inject(bundledExtensionsEventEmitterInjectable),
    proxyPort: di.inject(lensProxyPortInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default windowManagerInjectable;
