/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { InstallRequestValidated } from "./create-temp-files-and-validate.injectable";
import { Disposer, extractTar, noop } from "../../../../common/utils";
import { extensionDisplayName } from "../../../../extensions/lens-extension";
import type { ExtensionLoader } from "../../../../extensions/extension-loader";
import { getMessageFromError } from "../get-message-from-error/get-message-from-error";
import path from "path";
import fse from "fs-extra";
import { when } from "mobx";
import React from "react";
import type { ExtensionInstallationStateManager } from "../../../../extensions/installation-state/manager";
import type { OkNotification } from "../../notifications/ok.injectable";
import type { ErrorNotification } from "../../notifications/error.injectable";
import type { LensLogger } from "../../../../common/logger";
import extensionLoaderInjectable from "../../../../extensions/extension-loader/extension-loader.injectable";
import getExtensionDestFolderInjectable from "./get-extension-dest-folder.injectable";
import extensionInstallationStateManagerInjectable from "../../../../extensions/installation-state/manager.injectable";
import errorNotificationInjectable from "../../notifications/error.injectable";
import extensionsPageLoggerInjectable from "../logger.injectable";
import okNotificationInjectable from "../../notifications/ok.injectable";

export type UnpackExtension = (request: InstallRequestValidated, disposeDownloading?: Disposer) => Promise<void>;

interface Dependencies {
  extensionLoader: ExtensionLoader;
  getExtensionDestFolder: (name: string) => string;
  extensionInstallationStateStore: ExtensionInstallationStateManager;
  okNotification: OkNotification;
  errorNotification: ErrorNotification;
  logger: LensLogger;
}

const unpackExtension = ({
  extensionLoader,
  getExtensionDestFolder,
  extensionInstallationStateStore,
  okNotification,
  errorNotification,
  logger,
}: Dependencies): UnpackExtension => (
  async (request, disposeDownloading) => {
    const {
      id,
      fileName,
      tempFile,
      manifest: { name, version },
    } = request;

    extensionInstallationStateStore.setInstalling(id);
    disposeDownloading?.();

    const displayName = extensionDisplayName(name, version);
    const extensionFolder = getExtensionDestFolder(name);
    const unpackingTempFolder = path.join(
      path.dirname(tempFile),
      `${path.basename(tempFile)}-unpacked`,
    );

    logger.info(`Unpacking extension ${displayName}`, { fileName, tempFile });

    try {
      // extract to temp folder first
      await fse.remove(unpackingTempFolder).catch(noop);
      await fse.ensureDir(unpackingTempFolder);
      await extractTar(tempFile, { cwd: unpackingTempFolder });

      // move contents to extensions folder
      const unpackedFiles = await fse.readdir(unpackingTempFolder);
      let unpackedRootFolder = unpackingTempFolder;

      if (unpackedFiles.length === 1) {
        // check if %extension.tgz was packed with single top folder,
        // e.g. "npm pack %ext_name" downloads file with "package" root folder within tarball
        unpackedRootFolder = path.join(unpackingTempFolder, unpackedFiles[0]);
      }

      await fse.ensureDir(extensionFolder);
      await fse.move(unpackedRootFolder, extensionFolder, { overwrite: true });

      // wait for the loader has actually install it
      await when(() => extensionLoader.userExtensions.has(id));

      // Enable installed extensions by default.
      extensionLoader.setIsEnabled(id, true);

      okNotification(
        <p>
          Extension <b>{displayName}</b> successfully installed!
        </p>,
      );
    } catch (error) {
      const message = getMessageFromError(error);

      logger.info(`installing ${request.fileName} has failed`, error);
      errorNotification(
        <p>
            Installing extension <b>{displayName}</b> has failed: <em>{message}</em>
        </p>,
      );
    } finally {
      // Remove install state once finished
      extensionInstallationStateStore.clearInstalling(id);

      // clean up
      fse.remove(unpackingTempFolder).catch(noop);
      fse.unlink(tempFile).catch(noop);
    }
  }
);

const unpackExtensionInjectable = getInjectable({
  instantiate: (di) => unpackExtension({
    extensionLoader: di.inject(extensionLoaderInjectable),
    getExtensionDestFolder: di.inject(getExtensionDestFolderInjectable),
    extensionInstallationStateStore: di.inject(extensionInstallationStateManagerInjectable),
    errorNotification: di.inject(errorNotificationInjectable),
    okNotification: di.inject(okNotificationInjectable),
    logger: di.inject(extensionsPageLoggerInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default unpackExtensionInjectable;
