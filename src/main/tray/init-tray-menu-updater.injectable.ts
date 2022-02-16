/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { Menu, MenuItemConstructorOptions, Tray } from "electron";
import { autorun, IComputedValue } from "mobx";
import path from "path";
import type { LensLogger } from "../../common/logger";
import { isDevelopment } from "../../common/vars";
import type { WindowManager } from "../window/manager";
import { description } from "../../../package.json";
import isWindowsInjectable from "../../common/vars/is-windows.injectable";
import trayLoggerInjectable from "./logger.injectable";
import trayMenuItemsInjectable from "./menu-items.injectable";
import windowManagerInjectable from "../window/manager.injectable";

function getTrayIcon(): string {
  return path.resolve(
    __static,
    isDevelopment ? "../build/tray" : "icons", // copied within electron-builder extras
    "trayIconTemplate.png",
  );
}

// note: instance of Tray should be saved somewhere, otherwise it disappears
let tray: Tray;

interface Dependencies {
  windowManager: WindowManager;
  trayMenuItems: IComputedValue<MenuItemConstructorOptions[]>;
  logger: LensLogger;
  isWindows: boolean;
}

const initTrayMenuUpdater = ({
  windowManager,
  trayMenuItems,
  logger,
  isWindows,
}: Dependencies) => (
  () => {
    const icon = getTrayIcon();

    tray = new Tray(icon);
    tray.setToolTip(description);
    tray.setIgnoreDoubleClickEvents(true);

    if (isWindows) {
      tray.on("click", () => {
        windowManager
          .ensureMainWindow()
          .catch(error => logger.error("Failed to open lens", { error }));
      });
    }

    const stop = autorun(() => {
      try {
        tray.setContextMenu(Menu.buildFromTemplate(trayMenuItems.get()));
      } catch (error) {
        logger.error(`building failed`, { error });
      }
    });

    return () => {
      stop();
      tray?.destroy();
      tray = null;
    };
  }
);

const initTrayMenuUpdaterInjectable = getInjectable({
  instantiate: (di) => initTrayMenuUpdater({
    isWindows: di.inject(isWindowsInjectable),
    logger: di.inject(trayLoggerInjectable),
    trayMenuItems: di.inject(trayMenuItemsInjectable),
    windowManager: di.inject(windowManagerInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default initTrayMenuUpdaterInjectable;
