/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import protocolHandlerRouterLoggerInjectable from "../../common/protocol-handler/router-logger.injectable";
import extensionLoaderInjectable from "../../extensions/extension-loader/extension-loader.injectable";
import extensionsStoreInjectable from "../extensions/store.injectable";
import emitInvalidProtocolUrlInjectable from "../ipc/protocol-handler/invalid.injectable";
import emitRouteProtocolExternalInjectable from "../ipc/protocol-handler/route-external.injectable";
import emitRouteProtocolInternalInjectable from "../ipc/protocol-handler/route-internal.injectable";
import windowManagerInjectable from "../window/manager.injectable";
import { LensProtocolRouterMain } from "./router";

const lensProtocolRouterMainInjectable = getInjectable({
  instantiate: (di) => new LensProtocolRouterMain({
    extensionLoader: di.inject(extensionLoaderInjectable),
    extensionsStore: di.inject(extensionsStoreInjectable),
    emitInvalidProtocolUrl: di.inject(emitInvalidProtocolUrlInjectable),
    logger: di.inject(protocolHandlerRouterLoggerInjectable),
    windowManager: di.inject(windowManagerInjectable),
    emitRouteProtocolExternal: di.inject(emitRouteProtocolExternalInjectable),
    emitRouteProtocolInternal: di.inject(emitRouteProtocolInternalInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default lensProtocolRouterMainInjectable;
