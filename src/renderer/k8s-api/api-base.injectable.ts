/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { apiBaseInjectionToken } from "../../common/k8s-api/api-base.token";
import { JsonApi } from "../../common/k8s-api/json-api";
import { apiPrefix, isDevelopment, isDebugging } from "../../common/vars";
import errorNotificationInjectable from "../components/notifications/error.injectable";

const apiBaseInjectable = getInjectable({
  instantiate: (di) => {
    const errorNotification = di.inject(errorNotificationInjectable);
    const apiBase = new JsonApi({
      serverAddress: `http://127.0.0.1:${window.location.port}`,
      apiBase: apiPrefix,
      debug: isDevelopment || isDebugging,
    }, {
      headers: {
        "Host": window.location.host,
      },
    });

    apiBase.onError.addListener((error, res) => {
      switch (res.status) {
        case 403:
          error.isUsedForNotification = true;
          errorNotification(error);
          break;
      }
    });

    return apiBase;
  },
  injectionToken: apiBaseInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default apiBaseInjectable;
