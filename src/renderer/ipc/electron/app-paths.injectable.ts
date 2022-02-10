/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { AppPaths, appPathsInjectionToken } from "../../../common/ipc/electron/app-paths.token";
import getAppPathsInjectable from "./get-app-paths.injectable";

let appPaths: AppPaths;

const appPathsInjectable = getInjectable({
  setup: async (di) => {
    const getAppPaths = di.inject(getAppPathsInjectable);

    appPaths = await getAppPaths();
  },
  instantiate: () => appPaths,
  injectionToken: appPathsInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default appPathsInjectable;
