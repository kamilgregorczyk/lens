/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { injectSystemCAs } from "../common/system-ca";
import * as Mobx from "mobx";
import * as LensExtensionsCommonApi from "../extensions/common-api";
import * as LensExtensionsMainApi from "../extensions/main-api";
import { app, autoUpdater, dialog, powerMonitor } from "electron";
import { appName, isIntegrationTesting, isMac, isWindows, productName } from "../common/vars";
import { shellSync } from "./shell-sync";
import { mangleProxyEnv } from "./proxy-env";
import { registerFileProtocol } from "../common/register-protocol";
import type { InstalledExtension } from "../extensions/extension-discovery/extension-discovery";
import type { LensExtensionId } from "../extensions/lens-extension";
import { installDeveloperTools } from "./developer-tools";
import { disposer, getAppVersion } from "../common/utils";
import { HelmRepoManager } from "./helm/helm-repo-manager";
import configurePackages from "../common/configure-packages";
import { PrometheusProviderRegistry } from "./prometheus";
import * as initializers from "./initializers";
import { SentryInit } from "../common/sentry";
import { getDi } from "./getDi";
import extensionLoaderInjectable from "../extensions/extension-loader/extension-loader.injectable";
import lensProtocolRouterMainInjectable from "./protocol-handler/router.injectable";
import extensionDiscoveryInjectable from "../extensions/extension-discovery/extension-discovery.injectable";
import directoryForExesInjectable from "../common/directory-path/executables.injectable";
import kubeconfigSyncManagerInjectable from "./catalog/local-sources/kubeconfigs/manager.injectable";
import baseLoggerInjectable from "./logger/base-logger.injectable";
import appEventBusInjectable from "../common/app-event-bus/app-event-bus.injectable";
import windowManagerInjectable from "./window/manager.injectable";
import lensProxyInjectable from "./lens-proxy/proxy-injectable";
import getAppVersionFromProxyInjectable from "./lens-proxy/get-app-version.injectable";
import initAppMenuUpdaterInjectable from "./menu/init-app-menu-updater.injectable";
import clusterManagerInjectable from "./clusters/manager.injectable";
import initTrayMenuUpdaterInjectable from "./tray/init-tray-menu-updater.injectable";
import startUpdateCheckingInjectable from "./updater/start-update-checking.injectable";
import type { ConfigurableDependencyInjectionContainer } from "@ogre-tools/injectable";
import cleanupShellProcessesInjectable from "./shell-session/cleanup-processes.injectable";

app.setName(appName);
injectSystemCAs();
SentryInit();

async function main(di: ConfigurableDependencyInjectionContainer) {
  await di.runSetups();

  const onQuitCleanup = disposer();
  const logger = di.inject(baseLoggerInjectable);
  const appEventBus = di.inject(appEventBusInjectable);
  const windowManager = di.inject(windowManagerInjectable);
  const clusterManager = di.inject(clusterManagerInjectable);

  logger.info(`📟 Setting ${productName} as protocol client for lens://`);

  if (app.setAsDefaultProtocolClient("lens")) {
    logger.info("📟 Protocol client register succeeded ✅");
  } else {
    logger.info("📟 Protocol client register failed ❗");
  }

  if (process.env.LENS_DISABLE_GPU) {
    app.disableHardwareAcceleration();
  }

  logger.debug("[APP-MAIN] configuring packages");
  configurePackages();

  mangleProxyEnv();

  if (app.commandLine.getSwitchValue("proxy-server") !== "") {
    process.env.HTTPS_PROXY = app.commandLine.getSwitchValue("proxy-server");
  }

  logger.debug("[APP-MAIN] Lens protocol routing main");

  const lensProtocolRouterMain = di.inject(lensProtocolRouterMainInjectable);

  if (!app.requestSingleInstanceLock()) {
    app.exit();
  } else {
    for (const arg of process.argv) {
      if (arg.toLowerCase().startsWith("lens://")) {
        lensProtocolRouterMain.route(arg);
      }
    }
  }

  app.on("second-instance", (event, argv) => {
    logger.debug("second-instance message");

    for (const arg of argv) {
      if (arg.toLowerCase().startsWith("lens://")) {
        lensProtocolRouterMain.route(arg);
      }
    }

    windowManager.ensureMainWindow();
  });

  app.on("ready", async () => {
    const directoryForExes = di.inject(directoryForExesInjectable);

    logger.info(`🚀 Starting ${productName} from "${directoryForExes}"`);
    logger.info("🐚 Syncing shell environment");
    await shellSync();

    powerMonitor.on("shutdown", () => app.exit());

    registerFileProtocol("static", __static);

    PrometheusProviderRegistry.createInstance();
    initializers.initPrometheusProviderRegistry();

    logger.info("💾 Loading stores");

    HelmRepoManager.createInstance(); // create the instance

    const lensProxy = di.inject(lensProxyInjectable);

    try {
      logger.info("🔌 Starting LensProxy");
      await lensProxy.listen();
    } catch (error) {
      dialog.showErrorBox("Lens Error", `Could not start proxy: ${error?.message || "unknown error"}`);

      return app.exit();
    }

    // test proxy connection
    try {
      logger.info("🔎 Testing LensProxy connection ...");
      const getAppVersionFromProxyServer = di.inject(getAppVersionFromProxyInjectable);
      const versionFromProxy = await getAppVersionFromProxyServer();

      if (getAppVersion() !== versionFromProxy) {
        logger.error("Proxy server responded with invalid response");

        return app.exit();
      }

      logger.info("⚡ LensProxy connection OK");
    } catch (error) {
      logger.error(`🛑 LensProxy: failed connection test: ${error}`);

      const hostsPath = isWindows
        ? "C:\\windows\\system32\\drivers\\etc\\hosts"
        : "/etc/hosts";
      const message = [
        `Failed connection test: ${error}`,
        "Check to make sure that no other versions of Lens are running",
        `Check ${hostsPath} to make sure that it is clean and that the localhost loopback is at the top and set to 127.0.0.1`,
        "If you have HTTP_PROXY or http_proxy set in your environment, make sure that the localhost and the ipv4 loopback address 127.0.0.1 are added to the NO_PROXY environment variable.",
      ];

      dialog.showErrorBox("Lens Proxy Error", message.join("\n\n"));

      return app.exit();
    }

    const extensionLoader = di.inject(extensionLoaderInjectable);
    const extensionDiscovery = di.inject(extensionDiscoveryInjectable);
    const kubeConfigSyncManager = di.inject(kubeconfigSyncManagerInjectable);
    const startUpdateChecking = di.inject(startUpdateCheckingInjectable);

    extensionLoader.init();
    extensionDiscovery.init();
    kubeConfigSyncManager.startSync();
    startUpdateChecking();

    // Start the app without showing the main window when auto starting on login
    // (On Windows and Linux, we get a flag. On MacOS, we get special API.)
    const startHidden = process.argv.includes("--hidden") || (isMac && app.getLoginItemSettings().wasOpenedAsHidden);

    logger.info("🖥️  Starting WindowManager");

    const initMenu = di.inject(initAppMenuUpdaterInjectable);
    const initTray = di.inject(initTrayMenuUpdaterInjectable);
    const cleanupShellProcesses = di.inject(cleanupShellProcessesInjectable);

    onQuitCleanup.push(
      initMenu(),
      initTray(),
      cleanupShellProcesses,
    );

    installDeveloperTools();

    if (!startHidden) {
      windowManager.ensureMainWindow();
    }

    logger.info("🧩 Initializing extensions");

    // call after windowManager to see splash earlier
    try {
      const extensions = await extensionDiscovery.load();

      // Start watching after bundled extensions are loaded
      extensionDiscovery.watchExtensions();

      // Subscribe to extensions that are copied or deleted to/from the extensions folder
      extensionDiscovery.events
        .on("add", (extension: InstalledExtension) => {
          extensionLoader.addExtension(extension);
        })
        .on("remove", (lensExtensionId: LensExtensionId) => {
          extensionLoader.removeExtension(lensExtensionId);
        });

      extensionLoader.initExtensions(extensions);
    } catch (error) {
      dialog.showErrorBox("Lens Error", `Could not load extensions${error?.message ? `: ${error.message}` : ""}`);
      console.error(error);
      console.trace();
    }

    setTimeout(() => {
      appEventBus.emit({ name: "service", action: "start" });
    }, 1000);
  });

  app.on("activate", (event, hasVisibleWindows) => {
    logger.info("APP:ACTIVATE", { hasVisibleWindows });

    if (!hasVisibleWindows) {
      windowManager.ensureMainWindow(false);
    }
  });

  /**
 * This variable should is used so that `autoUpdater.installAndQuit()` works
 */
  let blockQuit = !isIntegrationTesting;

  autoUpdater.on("before-quit-for-update", () => {
    logger.debug("Unblocking quit for update");
    blockQuit = false;
  });

  app.on("will-quit", (event) => {
    logger.debug("will-quit message");

    // This is called when the close button of the main window is clicked


    logger.info("APP:QUIT");
    appEventBus.emit({ name: "app", action: "close" });
    clusterManager.stop(); // close cluster connections

    const kubeConfigSyncManager = di.inject(kubeconfigSyncManagerInjectable);

    kubeConfigSyncManager.stopSync();

    // This is set to false here so that LPRM can wait to send future lens://
    // requests until after it loads again
    lensProtocolRouterMain.rendererLoaded = false;

    if (blockQuit) {
    // Quit app on Cmd+Q (MacOS)

      event.preventDefault(); // prevent app's default shutdown (e.g. required for telemetry, etc.)

      return; // skip exit to make tray work, to quit go to app's global menu or tray's menu
    }

    lensProtocolRouterMain.cleanup();
    onQuitCleanup();
  });

  app.on("open-url", (event, rawUrl) => {
    logger.debug("open-url message");

    // lens:// protocol handler
    event.preventDefault();
    lensProtocolRouterMain.route(rawUrl);
  });

  logger.debug("[APP-MAIN] waiting for 'ready' and other messages");
}

main(getDi());

/**
 * Exports for virtual package "@k8slens/extensions" for main-process.
 * All exporting names available in global runtime scope:
 * e.g. global.Mobx, global.LensExtensions
 */
const LensExtensions = {
  Common: LensExtensionsCommonApi,
  Main: LensExtensionsMainApi,
};

export {
  Mobx,
  LensExtensions,
};
