/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { delay } from "../../../common/utils";
import type { LensLogger } from "../../../common/logger";
import { unmountComponentAtNode } from "react-dom";
import type { ExtensionLoading } from "../../../common/extensions/loader";
import type { ExtensionLoaded } from "../../../common/ipc/extensions/loaded.token";

interface Dependencies {
  loadExtensions: () => Promise<ExtensionLoading[]>;

  // TODO: Remove dependencies being here only for correct timing of initialization
  initCatalogEnityRunListener: () => void;
  initUpdateAvailableListener: () => void;
  initUpdateCheckingListener: () => void;
  initUpdateNotAvailableListener: () => void;
  initVisibleClusterChanged: () => void;
  initNavigateInAppListener: () => void;
  initNetworkEmitters: () => void;
  emitBundledExtensionsLoaded: ExtensionLoaded;
  logger: LensLogger;
}

export const initRootFrame = ({
  loadExtensions,
  initCatalogEnityRunListener,
  initUpdateAvailableListener,
  initUpdateCheckingListener,
  initUpdateNotAvailableListener,
  initVisibleClusterChanged,
  initNavigateInAppListener,
  initNetworkEmitters,
  emitBundledExtensionsLoaded,
  logger,
}: Dependencies) => (
  async (rootElem: HTMLElement) => {
    logger.info("Initializing root app");
    initCatalogEnityRunListener();
    initUpdateAvailableListener();
    initUpdateCheckingListener();
    initUpdateNotAvailableListener();
    initVisibleClusterChanged();
    initNavigateInAppListener();
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

    window.addEventListener("beforeunload", () => {
      logger.info("Unload app");

      unmountComponentAtNode(rootElem);
    });
  }
);
