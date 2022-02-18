/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { ExtensionLoader } from "../../../../common/extensions/loader";
import type { LensExtensionId } from "../../../../common/extensions/manifest";

interface Dependencies {
  extensionLoader: ExtensionLoader;
}

export const enableExtension =
  ({ extensionLoader }: Dependencies) =>
    (id: LensExtensionId) => {
      const extension = extensionLoader.getExtension(id);

      if (extension) {
        extension.isEnabled = true;
      }
    };
