/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { ExtensionLoader } from "./loader";
import updateExtensionsStateInjectable from "../preferences/update-store-state.injectable";
import createExtensionInstanceInjectable from "./create-extension-instance.injectable";
import extensionsLoaderLoggerInjectable from "./logger.injectable";

const extensionsLoaderInjectable = getInjectable({
  instantiate: (di) => new ExtensionLoader({
    updateExtensionsState: di.inject(updateExtensionsStateInjectable),
    createExtensionInstance: di.inject(createExtensionInstanceInjectable),
    logger: di.inject(extensionsLoaderLoggerInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default extensionsLoaderInjectable;
