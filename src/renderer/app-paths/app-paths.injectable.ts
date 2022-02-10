/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { AppPaths, getAppPathsInjectionToken, appPathsIpcChannel } from "../../common/directory-path/app-path-injection-token";
import getValueFromRegisteredChannelInjectable from "./get-value-from-registered-channel/get-value-from-registered-channel.injectable";

let syncAppPaths: AppPaths;

const appPathsInjectable = getInjectable({
  setup: async (di) => {
    const getValueFromRegisteredChannel = di.inject(
      getValueFromRegisteredChannelInjectable,
    );

    syncAppPaths = await getValueFromRegisteredChannel(appPathsIpcChannel);
  },

  instantiate: () => syncAppPaths,

  injectionToken: getAppPathsInjectionToken,

  lifecycle: lifecycleEnum.singleton,
});

export default appPathsInjectable;
