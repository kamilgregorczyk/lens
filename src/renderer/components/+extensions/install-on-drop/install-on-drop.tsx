/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { LensLogger } from "../../../../common/logger";

export type InstallOnDrop = (files: File[]) => Promise<void>;

interface Dependencies {
  attemptInstalls: (filePaths: string[]) => Promise<void>;
  logger: LensLogger;
}

export const installOnDrop = ({
  attemptInstalls,
  logger,
}: Dependencies): InstallOnDrop => (
  async (files: File[]) => {
    logger.info("Install from D&D");
    await attemptInstalls(files.map(({ path }) => path));
  }
);
