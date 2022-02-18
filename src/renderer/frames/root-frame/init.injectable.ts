/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { initRootFrame } from "./init";
import extensionsLoaderInjectable from "../../../common/extensions/loader/loader.injectable";
import initCatalogEntityRunListenerInjectable from "../../ipc/catalog/listeners/entity-run.injectable";
import extensionLoadedInjectable from "../../ipc/extensions/loaded.injectable";
import initNavigateInAppListenerInjectable from "../../ipc/window/listeners/navigate-in-app.injectable";
import initNetworkEmittersInjectable from "../../window/init-network-emitters.injectable";
import initUpdateAvailableListenerInjectable from "../../ipc/updates/listeners/available.injectable";
import initUpdateCheckingListenerInjectable from "../../ipc/updates/listeners/checking.injectable";
import initUpdateNotAvailableListenerInjectable from "../../ipc/updates/listeners/not-available.injectable";
import initVisibleClusterChangedInjectable from "../../window/init-visible-cluster-change.injectable";
import rootFrameLoggerInjectable from "./logger.injectable";

const initRootFrameInjectable = getInjectable({
  instantiate: (di) => initRootFrame({
    loadExtensions: di.inject(extensionsLoaderInjectable).loadOnClusterManagerRenderer,
    initCatalogEnityRunListener: di.inject(initCatalogEntityRunListenerInjectable),
    emitBundledExtensionsLoaded: di.inject(extensionLoadedInjectable),
    initNavigateInAppListener: di.inject(initNavigateInAppListenerInjectable),
    initNetworkEmitters: di.inject(initNetworkEmittersInjectable),
    initUpdateAvailableListener: di.inject(initUpdateAvailableListenerInjectable),
    initUpdateCheckingListener: di.inject(initUpdateCheckingListenerInjectable),
    initUpdateNotAvailableListener: di.inject(initUpdateNotAvailableListenerInjectable),
    initVisibleClusterChanged: di.inject(initVisibleClusterChangedInjectable),
    logger: di.inject(rootFrameLoggerInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default initRootFrameInjectable;
