/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { delay } from "../../../../common/utils";
import logger from "../../../../common/logger";
import { unmountComponentAtNode } from "react-dom";
import type { ExtensionLoading } from "../../../../extensions/extension-loader";
import type { CatalogEntityRegistry } from "../../../api/catalog-entity-registry";
import type { BundledExtensionsLoaded } from "../../../../common/ipc/extensions/bundled-loaded.token";

interface Dependencies {
  loadExtensions: () => Promise<ExtensionLoading[]>;

  // TODO: Remove dependencies being here only for correct timing of initialization
  bindProtocolAddRouteHandlers: () => void;
  lensProtocolRouterRenderer: { init: () => void };
  catalogEntityRegistry: CatalogEntityRegistry;
  initCatalogEnityRunListener: () => void;
  initUpdateAvailableListener: () => void;
  initUpdateCheckingListener: () => void;
  initUpdateNotAvailableListener: () => void;
  initVisibleClusterChanged: () => void;
  initNavigateInAppListener: () => void;
  initNavigateExtensionListener: () => void;
  initReloadPageListener: () => void;
  initNetworkEmitters: () => void;
  emitBundledExtensionsLoaded: BundledExtensionsLoaded;
}

const logPrefix = "[ROOT-FRAME]:";

export const initRootFrame = ({
  loadExtensions,
  bindProtocolAddRouteHandlers,
  lensProtocolRouterRenderer,
  initCatalogEnityRunListener,
  initUpdateAvailableListener,
  initUpdateCheckingListener,
  initUpdateNotAvailableListener,
  initVisibleClusterChanged,
  initNavigateInAppListener,
  initNavigateExtensionListener,
  initReloadPageListener,
  initNetworkEmitters,
  emitBundledExtensionsLoaded,
  catalogEntityRegistry,
}: Dependencies) => (
  async (rootElem: HTMLElement) => {
    catalogEntityRegistry.init();
    initCatalogEnityRunListener();
    initUpdateAvailableListener();
    initUpdateCheckingListener();
    initUpdateNotAvailableListener();
    initVisibleClusterChanged();
    initNavigateInAppListener();
    initNavigateExtensionListener();
    initReloadPageListener();
    initNetworkEmitters();

    try {
      // maximum time to let bundled extensions finish loading
      const timeout = delay(10000);

      const loadingExtensions = await loadExtensions();

      const loadingBundledExtensions = loadingExtensions
        .filter((e) => e.isBundled)
        .map((e) => e.loaded);

      const bundledExtensionsFinished = Promise.all(loadingBundledExtensions);

      await Promise.race([bundledExtensionsFinished, timeout]);
    } finally {
      emitBundledExtensionsLoaded();
    }

    lensProtocolRouterRenderer.init();

    bindProtocolAddRouteHandlers();

    window.addEventListener("beforeunload", () => {
      logger.info(`${logPrefix} Unload app`);

      unmountComponentAtNode(rootElem);
    });
  }
);
