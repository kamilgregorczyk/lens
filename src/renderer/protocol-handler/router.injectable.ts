/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import protocolHandlerRouterLoggerInjectable from "../../common/protocol-handler/router-logger.injectable";
import extensionLoaderInjectable from "../../extensions/extension-loader/extension-loader.injectable";
import shortInfoNotificationInjectable from "../components/notifications/short-info.injectable";
import extensionsPreferencesStoreInjectable from "../extensions/store.injectable";
import { LensProtocolRouterRenderer } from "./router";

const lensProtocolRouterRendererInjectable = getInjectable({
  instantiate: (di) => new LensProtocolRouterRenderer({
    extensionLoader: di.inject(extensionLoaderInjectable),
    extensionsPreferencesStore: di.inject(extensionsPreferencesStoreInjectable),
    shortInfoNotification: di.inject(shortInfoNotificationInjectable),
    logger: di.inject(protocolHandlerRouterLoggerInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default lensProtocolRouterRendererInjectable;
