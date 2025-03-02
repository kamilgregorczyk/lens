/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

/*
  Cluster tests are run if there is a pre-existing minikube cluster. Before running cluster tests the TEST_NAMESPACE
  namespace is removed, if it exists, from the minikube cluster. Resources are created as part of the cluster tests in the
  TEST_NAMESPACE namespace. This is done to minimize destructive impact of the cluster tests on an existing minikube
  cluster and vice versa.
*/
import type { ElectronApplication, Page } from "playwright";
import * as utils from "../helpers/utils";
import { isWindows } from "../../src/common/vars";

describe("preferences page tests", () => {
  let window: Page, cleanup: () => Promise<void>;

  beforeEach(async () => {
    let app: ElectronApplication;

    ({ window, cleanup, app } = await utils.start());
    await utils.clickWelcomeButton(window);

    await app.evaluate(async ({ app }) => {
      await app.applicationMenu
        .getMenuItemById(process.platform === "darwin" ? "root" : "file")
        .submenu.getMenuItemById("preferences")
        .click();
    });
  }, 10*60*1000);

  afterEach(async () => {
    await cleanup();
  }, 10*60*1000);

  // skip on windows due to suspected playwright issue with Electron 14
  utils.itIf(!isWindows)('shows "preferences" and can navigate through the tabs', async () => {
    const pages = [
      {
        id: "application",
        header: "Application",
      },
      {
        id: "proxy",
        header: "Proxy",
      },
      {
        id: "kubernetes",
        header: "Kubernetes",
      },
    ];

    for (const { id, header } of pages) {
      await window.click(`[data-testid=${id}-tab]`);
      await window.waitForSelector(`[data-testid=${id}-header] >> text=${header}`);
    }
  }, 10*60*1000);

  // Skipping, but will turn it on again in the follow up PR
  it.skip("ensures helm repos", async () => {
    await window.click("[data-testid=kubernetes-tab]");
    await window.waitForSelector("[data-testid=repository-name]");
    await window.click("#HelmRepoSelect");
    await window.waitForSelector("div.Select__option");
  }, 10*60*1000);
});
