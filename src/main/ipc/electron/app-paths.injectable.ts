/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getAppPathsInjectionToken } from "../../../common/ipc/electron/get-app-paths.token";
import appPathsInjectable from "../../electron/app-paths.injectable";
import { implWithHandle } from "../impl-with-handle";

export const getAppPathsInjectable = implWithHandle(getAppPathsInjectionToken, (di) => {
  const appPaths = di.inject(appPathsInjectable);

  return () => Promise.resolve(appPaths);
});
