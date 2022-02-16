/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { MenuItemConstructorOptions } from "electron";
import { computed, IComputedValue } from "mobx";
import type { NavigateInApp } from "../../common/ipc/window/navigate-in-app.token";
import type { LensLogger } from "../../common/logger";
import { preferencesURL } from "../../common/routes";
import { ignoreIf } from "../../common/utils/array";
import { productName } from "../../common/vars";
import type { ExitApp } from "../exit-app.injectable";
import exitAppInjectable from "../exit-app.injectable";
import navigateInAppInjectable from "../ipc/window/navigate-in-app.injectable";
import { showAbout } from "../menu/show-about";
import type { CheckForUpdates } from "../updater/check-for-updates.injectable";
import checkForUpdatesInjectable from "../updater/check-for-updates.injectable";
import type { IsAutoUpdateEnabled } from "../updater/is-auto-update-enabled.injectable";
import isAutoUpdateEnabledInjectable from "../updater/is-auto-update-enabled.injectable";
import type { WindowManager } from "../window/manager";
import windowManagerInjectable from "../window/manager.injectable";
import extensionTrayMenuItemsInjectable from "./extension-menu-items.injectable";
import trayLoggerInjectable from "./logger.injectable";
import type { TrayMenuRegistration } from "./tray-menu-registration";

interface Dependencies {
  extensionItems: IComputedValue<TrayMenuRegistration[]>;
  windowManager: WindowManager;
  logger: LensLogger;
  navigate: NavigateInApp;
  isAutoUpdateEnabled: IsAutoUpdateEnabled;
  checkForUpdates: CheckForUpdates;
  exitApp: ExitApp;
}

function getMenuItemConstructorOptions(trayItem: TrayMenuRegistration): Electron.MenuItemConstructorOptions {
  return {
    ...trayItem,
    submenu: trayItem.submenu ? trayItem.submenu.map(getMenuItemConstructorOptions) : undefined,
    click: trayItem.click ? () => {
      trayItem.click(trayItem);
    } : undefined,
  };
}

const trayMenuItems = ({
  extensionItems,
  windowManager,
  logger,
  navigate,
  isAutoUpdateEnabled,
  checkForUpdates,
  exitApp,
}: Dependencies): IComputedValue<MenuItemConstructorOptions[]> => (
  computed(() => [
    {
      label: `About ${productName}`,
      click() {
        windowManager.ensureMainWindow()
          .then(showAbout)
          .catch(error => logger.error("Failed to show Lens About view", { error }));
      },
    },
    { type: "separator" },
    {
      label: "Quit App",
      click() {
        exitApp();
      },
    },
    {
      label: `Open ${productName}`,
      click() {
        windowManager
          .ensureMainWindow()
          .catch(error => logger.error("Failed to open lens", error));
      },
    },
    {
      label: "Preferences",
      click() {
        navigate(preferencesURL());
      },
    },
    ...ignoreIf(isAutoUpdateEnabled(), [
      {
        label: "Check for updates",
        click() {
          checkForUpdates()
            .then(() => windowManager.ensureMainWindow());
        },
      },
    ]),
    ...extensionItems.get().map(getMenuItemConstructorOptions),
  ])
);

const trayMenuItemsInjectable = getInjectable({
  instantiate: (di) => trayMenuItems({
    extensionItems: di.inject(extensionTrayMenuItemsInjectable),
    windowManager: di.inject(windowManagerInjectable),
    logger: di.inject(trayLoggerInjectable),
    navigate: di.inject(navigateInAppInjectable),
    checkForUpdates: di.inject(checkForUpdatesInjectable),
    isAutoUpdateEnabled: di.inject(isAutoUpdateEnabledInjectable),
    exitApp: di.inject(exitAppInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default trayMenuItemsInjectable;
