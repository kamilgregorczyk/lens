/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { RequestDirectory } from "../common/file-system-provisioner/request-directory.injectable";
import type { AddCategoryFilter } from "../renderer/catalog/category/add-filter.injectable";
import type { AddEntityFilter } from "../renderer/catalog/entity/add-filter.injectable";

// This symbol encapsulates setting of dependencies to only happen locally in Lens Core
// and not by e.g. authors of extensions
export const extensionDependencies = Symbol("lens-extension-dependencies");

export interface LensExtensionDependencies {
  requestDirectory: RequestDirectory;
}

export interface LensRendererExtensionDependencies extends LensExtensionDependencies {
  navigate: (url: string) => void;
  addEntityFilter: AddEntityFilter;
  addCategoryFilter: AddCategoryFilter;
}

export interface LensMainExtensionDependencies extends LensExtensionDependencies {
  navigateExtension: (extId: string, pageId?: string, params?: Record<string, any>, frameId?: number) => void;
}
