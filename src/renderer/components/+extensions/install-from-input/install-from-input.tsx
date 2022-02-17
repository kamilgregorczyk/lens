/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { downloadFile, ExtendableDisposer } from "../../../../common/utils";
import { InputValidators } from "../../input";
import { getMessageFromError } from "../get-message-from-error/get-message-from-error";
import path from "path";
import React from "react";
import { readFileNotify } from "../read-file-notify/read-file-notify";
import type { AttemptInstallByInfo } from "../attempt-install-by-info/attempt-install-by-info";
import type { ExtensionInstallationStateManager } from "../../../../extensions/installation-state/manager";
import type { ErrorNotification } from "../../notifications/error.injectable";
import type { LensLogger } from "../../../../common/logger";
import type { AttemptInstall } from "../attempt-install/attempt-install.injectable";

export type InstallFromInput = (input: string) => Promise<void>;

interface Dependencies {
  attemptInstall: AttemptInstall;
  attemptInstallByInfo: AttemptInstallByInfo;
  installationStateManager: ExtensionInstallationStateManager;
  errorNotification: ErrorNotification;
  logger: LensLogger;
}

export const installFromInput = ({
  attemptInstall,
  attemptInstallByInfo,
  installationStateManager,
  errorNotification,
  logger,
}: Dependencies): InstallFromInput => (
  async (input) => {
    let disposer: ExtendableDisposer | undefined = undefined;

    try {
    // fixme: improve error messages for non-tar-file URLs
      if (InputValidators.isUrl.validate(input)) {
      // install via url
        disposer = installationStateManager.startPreInstall();
        const { promise } = downloadFile({ url: input, timeout: 10 * 60 * 1000 });
        const fileName = path.basename(input);

        await attemptInstall({ fileName, dataP: promise }, disposer);
      } else if (InputValidators.isPath.validate(input)) {
      // install from system path
        const fileName = path.basename(input);

        await attemptInstall({ fileName, dataP: readFileNotify(input) });
      } else if (InputValidators.isExtensionNameInstall.validate(input)) {
        const [{ groups: { name, version }}] = [...input.matchAll(InputValidators.isExtensionNameInstallRegex)];

        await attemptInstallByInfo({ name, version });
      }
    } catch (error) {
      const message = getMessageFromError(error);

      logger.info(`[EXTENSION-INSTALL]: installation has failed: ${message}`, { error, installPath: input });
      errorNotification(<p>Installation has failed: <b>{message}</b></p>);
    } finally {
      disposer?.();
    }
  }
);
