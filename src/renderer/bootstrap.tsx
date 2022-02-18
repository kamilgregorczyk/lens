/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./components/app.scss";

import React from "react";
import * as Mobx from "mobx";
import * as MobxReact from "mobx-react";
import * as ReactRouter from "react-router";
import * as ReactRouterDom from "react-router-dom";
import * as LensExtensionsCommonApi from "../extensions/common-api";
import * as LensExtensionsRendererApi from "../extensions/renderer-api";
import { render } from "react-dom";
import { delay } from "../common/utils";
import { isMac, isDevelopment } from "../common/vars";
import { HelmRepoManager } from "../main/helm/helm-repo-manager";
import { DefaultProps } from "./mui-base-theme";
import configurePackages from "../common/configure-packages";
import * as initializers from "./initializers";
import { registerCustomThemes } from "./components/monaco-editor";
import { getDi } from "./getDi";
import { DiContextProvider } from "@ogre-tools/injectable-react";
import type { DependencyInjectionContainer } from "@ogre-tools/injectable";
import extensionsLoaderInjectable from "../common/extensions/loader/loader.injectable";
import initRootFrameInjectable from "./frames/root-frame/init.injectable";
import initClusterFrameInjectable from "./frames/cluster-frame/init.injectable";
import commandOverlayInjectable from "./components/command-palette/command-overlay.injectable";
import userStoreInjectable from "./user-preferences/store.injectable";
import initSentryInjectable from "../common/error-reporting/init-sentry.injectable";
import createChildLoggerInjectable from "../common/logger/create-child-logger.injectable";

configurePackages(); // global packages
registerCustomThemes(); // monaco editor themes

/**
 * If this is a development build, wait a second to attach
 * Chrome Debugger to renderer process
 * https://stackoverflow.com/questions/52844870/debugging-electron-renderer-process-with-vscode
 */
async function attachChromeDebugger() {
  if (isDevelopment) {
    await delay(1000);
  }
}

export async function bootstrap(di: DependencyInjectionContainer) {
  await di.runSetups();

  if (process.isMainFrame) {
    const initSentry = di.inject(initSentryInjectable);

    initSentry();
  }

  const rootElem = document.getElementById("app");
  const createChildLogger = di.inject(createChildLoggerInjectable);
  const frameName = process.isMainFrame ? "ROOT" : "CLUSTER";
  const logger = createChildLogger(`BOOTSTRAP-${frameName}-FRAME`);

  // TODO: Remove temporal dependencies to make timing of initialization not important
  di.inject(userStoreInjectable);

  await attachChromeDebugger();
  rootElem.classList.toggle("is-mac", isMac);

  logger.info(`initializing Registries`);
  initializers.initRegistries();

  logger.info(`initializing EntitySettingsRegistry`);
  initializers.initEntitySettingsRegistry();

  logger.info(`initializing KubeObjectDetailRegistry`);
  initializers.initKubeObjectDetailRegistry();

  logger.info(`initializing WorkloadsOverviewDetailRegistry`);
  initializers.initWorkloadsOverviewDetailRegistry();

  logger.info(`initializing CatalogEntityDetailRegistry`);
  initializers.initCatalogEntityDetailRegistry();

  logger.info(`initializing CatalogCategoryRegistryEntries`);
  initializers.initCatalogCategoryRegistryEntries();

  logger.info(`initializing Catalog`);
  initializers.initCatalog({
    openCommandDialog: di.inject(commandOverlayInjectable).open,
  });

  const extensionLoader = di.inject(extensionsLoaderInjectable);

  extensionLoader.init();

  HelmRepoManager.createInstance(); // initialize the manager

  let App;
  let initializeApp;

  // TODO: Introduce proper architectural boundaries between root and cluster iframes
  if (process.isMainFrame) {
    initializeApp = di.inject(initRootFrameInjectable);
    App = (await import("./frames/root-frame/root-frame")).RootFrame;
  } else {
    initializeApp = di.inject(initClusterFrameInjectable);
    App = (await import("./frames/cluster-frame/cluster-frame")).ClusterFrame;
  }

  await initializeApp(rootElem);

  render(
    <DiContextProvider value={{ di }}>
      {DefaultProps(App)}
    </DiContextProvider>,

    rootElem,
  );
}

// run
bootstrap(getDi());

/**
 * Exports for virtual package "@k8slens/extensions" for renderer-process.
 * All exporting names available in global runtime scope:
 * e.g. Devtools -> Console -> window.LensExtensions (renderer)
 */
const LensExtensions = {
  Common: LensExtensionsCommonApi,
  Renderer: LensExtensionsRendererApi,
};

export {
  React,
  ReactRouter,
  ReactRouterDom,
  Mobx,
  MobxReact,
  LensExtensions,
};
