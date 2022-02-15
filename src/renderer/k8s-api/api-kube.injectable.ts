/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { KubeJsonApi } from "../../common/k8s-api/kube-json-api";
import { apiKubePrefix, isDevelopment } from "../../common/vars";
import errorNotificationInjectable from "../components/notifications/error.injectable";
import { isClusterPageContext } from "../utils";

const apiKubeInjectable = getInjectable({
  instantiate: (di) => {
    const errorNotification = di.inject(errorNotificationInjectable);

    if (!isClusterPageContext()) {
      return undefined;
    }

    const apiKube = new KubeJsonApi({
      serverAddress: `http://127.0.0.1:${window.location.port}`,
      apiBase: apiKubePrefix,
      debug: isDevelopment,
    }, {
      headers: {
        "Host": window.location.host,
      },
    });

    apiKube.onError.addListener((error, res) => {
      switch (res.status) {
        case 403:
          error.isUsedForNotification = true;
          errorNotification(error);
          break;
      }
    });

    return apiKube;
  },
  lifecycle: lifecycleEnum.singleton,
});

export default apiKubeInjectable;
