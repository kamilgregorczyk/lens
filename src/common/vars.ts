/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

// App's common configuration for any process (main, renderer, build pipeline, etc.)
import path from "path";
import { SemVer } from "semver";
import packageInfo from "../../package.json";
import { asLegacyGlobalObjectForExtensionApi } from "../extensions/di-legacy-globals/as-legacy-global-object-for-extension-api";
import { defineGlobal } from "./utils/defineGlobal";
import isLinuxInjectable from "./vars/is-linux.injectable";
import isMacInjectable from "./vars/is-mac.injectable";
import isTestEnvInjectable from "./vars/is-test-env.injectable";
import isWindowsInjectable from "./vars/is-windows.injectable";

/**
 * @deprecated use di.inject(isMacInjectable) instead
 */
export const isMac = asLegacyGlobalObjectForExtensionApi(isMacInjectable);

/**
 * @deprecated use di.inject(isWindowsInjectable) instead
 */
export const isWindows = asLegacyGlobalObjectForExtensionApi(isWindowsInjectable);

/**
 * @deprecated use di.inject(isLinuxInjectable) instead
 */
export const isLinux = asLegacyGlobalObjectForExtensionApi(isLinuxInjectable);

/**
 * @deprecated use di.inject(isTestEnvInjectable) instead
 */
export const isTestEnv = asLegacyGlobalObjectForExtensionApi(isTestEnvInjectable);

/**
 * @deprecated use di.inject(isProductionInjectable) instead
 */
export const isProduction = process.env.NODE_ENV === "production";

export const isDebugging = ["true", "1", "yes", "y", "on"].includes((process.env.DEBUG ?? "").toLowerCase());
export const isSnap = !!process.env.SNAP;
export const isDevelopment = !isTestEnv && !isProduction;

export const integrationTestingArg = "--integration-testing";
export const isIntegrationTesting = process.argv.includes(integrationTestingArg);

export const productName = packageInfo.productName;
export const appName = `${packageInfo.productName}${isDevelopment ? "Dev" : ""}`;
export const publicPath = "/build/" as string;
export const defaultTheme = "lens-dark" as string;
export const defaultFontSize = 12;
export const defaultTerminalFontFamily = "RobotoMono";
export const defaultEditorFontFamily = "RobotoMono";

// Webpack build paths
export const contextDir = process.cwd();
export const buildDir = path.join(contextDir, "static", publicPath);
export const preloadEntrypoint = path.join(contextDir, "src/preload.ts");
export const mainDir = path.join(contextDir, "src/main");
export const rendererDir = path.join(contextDir, "src/renderer");
export const htmlTemplate = path.resolve(rendererDir, "template.html");
export const sassCommonVars = path.resolve(rendererDir, "components/vars.scss");
export const webpackDevServerPort = 9009;

// Special runtime paths
defineGlobal("__static", {
  get() {
    const root = isDevelopment
      ? contextDir
      : (process.resourcesPath ?? contextDir);

    return path.resolve(root, "static");
  },
});

// Apis
export const apiPrefix = "/api" as string; // local router apis
export const apiKubePrefix = "/api-kube" as string; // k8s cluster apis
export const shellRoute = "/shell" as string;

// Links
export const issuesTrackerUrl = "https://github.com/lensapp/lens/issues" as string;
export const slackUrl = "https://join.slack.com/t/k8slens/shared_invite/zt-wcl8jq3k-68R5Wcmk1o95MLBE5igUDQ" as string;
export const supportUrl = "https://docs.k8slens.dev/latest/support/" as string;

export const appSemVer = new SemVer(packageInfo.version);
export const docsUrl = "https://docs.k8slens.dev/main/" as string;
