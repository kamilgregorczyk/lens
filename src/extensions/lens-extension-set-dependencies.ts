/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { RequestDirectory } from "../common/file-system-provisioner/request-directory.injectable";

// This symbol encapsulates setting of dependencies to only happen locally in Lens Core
// and not by e.g. authors of extensions
export const setLensExtensionDependencies = Symbol("set-lens-extension-dependencies");

export interface LensExtensionDependencies {
  requestDirectory: RequestDirectory;
}
