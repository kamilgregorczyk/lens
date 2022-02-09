/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import extensionLoaderInjectable from "../../../extensions/extension-loader/extension-loader.injectable";
import extensionsStoreInjectable from "../../extensions/store.injectable";
import { LensProtocolRouterRenderer } from "./lens-protocol-router-renderer";

const lensProtocolRouterRendererInjectable = getInjectable({
  instantiate: (di) =>
    new LensProtocolRouterRenderer({
      extensionLoader: di.inject(extensionLoaderInjectable),
      extensionsStore: di.inject(extensionsStoreInjectable),
    }),

  lifecycle: lifecycleEnum.singleton,
});

export default lensProtocolRouterRendererInjectable;
