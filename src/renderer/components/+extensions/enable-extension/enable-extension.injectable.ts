/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import extensionsLoaderInjectable from "../../../../common/extensions/loader/loader.injectable";
import { enableExtension } from "./enable-extension";

const enableExtensionInjectable = getInjectable({
  instantiate: (di) => enableExtension({
    extensionLoader: di.inject(extensionsLoaderInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default enableExtensionInjectable;
