/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { ExtensionLoader } from "../../../extensions/extension-loader";
import { extensionDisplayName, LensExtensionId } from "../../../extensions/lens-extension";
import React from "react";
import { when } from "mobx";
import { getMessageFromError } from "./get-message-from-error/get-message-from-error";
import type { ExtensionInstallationStateManager } from "../../../extensions/installation-state/manager";
import type { OkNotification } from "../notifications/ok.injectable";
import type { ErrorNotification } from "../notifications/error.injectable";
import type { LensLogger } from "../../../common/logger";
import type { UninstallExtension } from "../../../common/ipc/extensions/uninstall.token";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import extensionLoaderInjectable from "../../../extensions/extension-loader/extension-loader.injectable";
import extensionInstallationStateManagerInjectable from "../../../extensions/installation-state/manager.injectable";
import extensionsPageLoggerInjectable from "./logger.injectable";
import errorNotificationInjectable from "../notifications/error.injectable";
import okNotificationInjectable from "../notifications/ok.injectable";
import requestUninstallExtensionInjectable from "../../ipc/extensions/uninstall.injectable";

export type CheckedUninstallExtension = (extensionId: LensExtensionId) => Promise<boolean>;

interface Dependencies {
  extensionLoader: ExtensionLoader;
  extensionInstallationStateStore: ExtensionInstallationStateManager;
  okNotification: OkNotification;
  errorNotification: ErrorNotification;
  logger: LensLogger;
  uninstallExtension: UninstallExtension;
}

const checkedUninstallExtension = ({
  extensionLoader,
  uninstallExtension,
  extensionInstallationStateStore,
  okNotification,
  errorNotification,
  logger,
}: Dependencies): CheckedUninstallExtension => (
  async (extensionId) => {
    const { manifest } = extensionLoader.getExtension(extensionId);
    const displayName = extensionDisplayName(manifest.name, manifest.version);

    try {
      logger.debug(`trying to uninstall ${extensionId}`);
      extensionInstallationStateStore.setUninstalling(extensionId);

      await uninstallExtension(extensionId);

      // wait for the ExtensionLoader to actually uninstall the extension
      await when(() => !extensionLoader.userExtensions.has(extensionId));

      okNotification(
        <p>
          Extension <b>{displayName}</b> successfully uninstalled!
        </p>,
      );

      return true;
    } catch (error) {
      const message = getMessageFromError(error);

      logger.info(`uninstalling ${displayName} has failed`, error);
      errorNotification(
        <p>
          Uninstalling extension <b>{displayName}</b> has failed: <em>{message}</em>
        </p>,
      );

      return false;
    } finally {
      // Remove uninstall state on uninstall failure
      extensionInstallationStateStore.clearUninstalling(extensionId);
    }
  }
);

const checkedUninstallExtensionInjectable = getInjectable({
  instantiate: (di) => checkedUninstallExtension({
    extensionLoader: di.inject(extensionLoaderInjectable),
    uninstallExtension: di.inject(requestUninstallExtensionInjectable),
    extensionInstallationStateStore: di.inject(extensionInstallationStateManagerInjectable),
    logger: di.inject(extensionsPageLoggerInjectable),
    errorNotification: di.inject(errorNotificationInjectable),
    okNotification: di.inject(okNotificationInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default checkedUninstallExtensionInjectable;
