/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { readFileNotify } from "../read-file-notify/read-file-notify";
import path from "path";
import type { AttemptInstall } from "../attempt-install/attempt-install.injectable";

export type AttemptInstalls = (filePaths: string[]) => Promise<void>;

interface Dependencies {
  attemptInstall: AttemptInstall;
}

export const attemptInstalls = ({
  attemptInstall,
}: Dependencies): AttemptInstalls => (
  async (filePaths) => {
    const promises: Promise<void>[] = [];

    for (const filePath of filePaths) {
      promises.push(
        attemptInstall({
          fileName: path.basename(filePath),
          dataP: readFileNotify(filePath),
        }),
      );
    }

    await Promise.allSettled(promises);
  }
);
