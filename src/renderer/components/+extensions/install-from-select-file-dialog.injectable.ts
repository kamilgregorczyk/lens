/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { supportedExtensionFormats } from "./supported-extension-formats";
import attemptInstallsInjectable from "./attempt-installs/attempt-installs.injectable";
import directoryForDownloadsInjectable from "../../../common/paths/downloads.injectable";
import type { OpenFilePicker } from "../../../common/ipc/file-dialog/open.token";
import openFileDialogInjectable from "../../ipc/file-dialog/open.injectable";

export type InstallFromSelectFileDialog = () => Promise<void>;

interface Dependencies {
  attemptInstalls: (filePaths: string[]) => Promise<void>;
  directoryForDownloads: string;
  openFilePicker: OpenFilePicker;
}

const installFromSelectFileDialog = ({
  attemptInstalls,
  directoryForDownloads,
  openFilePicker,
}: Dependencies): InstallFromSelectFileDialog => (
  async () => {
    const result = await openFilePicker({
      defaultPath: directoryForDownloads,
      properties: ["openFile", "multiSelections"],
      message: `Select extensions to install (formats: ${supportedExtensionFormats.join(", ")}), `,
      buttonLabel: "Use configuration",
      filters: [{ name: "tarball", extensions: supportedExtensionFormats }],
    });

    if (result.canceled === false) {
      await attemptInstalls(result.filePaths);
    }
  }
);

const installFromSelectFileDialogInjectable = getInjectable({
  instantiate: (di) => installFromSelectFileDialog({
    attemptInstalls: di.inject(attemptInstallsInjectable),
    directoryForDownloads: di.inject(directoryForDownloadsInjectable),
    openFilePicker: di.inject(openFileDialogInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default installFromSelectFileDialogInjectable;
