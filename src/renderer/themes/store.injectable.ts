/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import themeStoreLoggerInjectable from "./logger.injectable";
import { ThemeStore } from "./store";

const themeStoreInjectable = getInjectable({
  instantiate: (di) => new ThemeStore({
    logger: di.inject(themeStoreLoggerInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default themeStoreInjectable;
