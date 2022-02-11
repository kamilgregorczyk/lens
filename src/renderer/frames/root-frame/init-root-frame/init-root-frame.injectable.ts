/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { initRootFrame } from "./init-root-frame";
import extensionLoaderInjectable from "../../../../extensions/extension-loader/extension-loader.injectable";
import bindProtocolAddRouteHandlersInjectable from "../../../protocol-handler/bind-protocol-add-route-handlers/bind-protocol-add-route-handlers.injectable";
import lensProtocolRouterRendererInjectable from "../../../protocol-handler/lens-protocol-router-renderer/lens-protocol-router-renderer.injectable";
import catalogEntityRegistryInjectable from "../../../catalog/entity-registry.injectable";
import initCatalogEntityRunListenerInjectable from "../../../ipc/catalog-entity/listeners/run.injectable";

const initRootFrameInjectable = getInjectable({
  instantiate: (di) => {
    const extensionLoader = di.inject(extensionLoaderInjectable);

    return initRootFrame({
      loadExtensions: extensionLoader.loadOnClusterManagerRenderer,
      bindProtocolAddRouteHandlers: di.inject(bindProtocolAddRouteHandlersInjectable),
      lensProtocolRouterRenderer: di.inject(lensProtocolRouterRendererInjectable),
      catalogEntityRegistry: di.inject(catalogEntityRegistryInjectable),
      initCatalogEnityRunListener: di.inject(initCatalogEntityRunListenerInjectable),
    });
  },

  lifecycle: lifecycleEnum.singleton,
});

export default initRootFrameInjectable;
