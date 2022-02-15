/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { when } from "mobx";
import { apiBaseInjectionToken } from "../../common/k8s-api/api-base.token";
import { JsonApi } from "../../common/k8s-api/json-api";
import { apiPrefix, isDevelopment, isDebugging } from "../../common/vars";
import lensProxyPortInjectable from "../lens-proxy/port.injectable";

let apiBase: JsonApi;

const apiBaseInjectable = getInjectable({
  setup: (di) => {
    const proxyPort = di.inject(lensProxyPortInjectable);

    when(
      () => typeof proxyPort.port.get() === "number",
      () => {
        const port = proxyPort.port.get();

        apiBase = new JsonApi({
          serverAddress: `http://127.0.0.1:${port}`,
          apiBase: apiPrefix,
          debug: isDevelopment || isDebugging,
        }, {
          headers: {
            "Host": `localhost:${port}`,
          },
        });
      });
  },
  instantiate: () => apiBase,
  injectionToken: apiBaseInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default apiBaseInjectable;
