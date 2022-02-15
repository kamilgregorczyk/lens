/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import appEventBusInjectable from "../../common/app-event-bus/app-event-bus.injectable";
import getClusterForRequestInjectable from "../clusters/get-cluster-for-request.injectable";
import { kubeApiRequest } from "../proxy-functions";
import catalogApiRequestHandlerInjectable from "../proxy-functions/catalog-api-request/handler.injectable";
import shellApiRequestInjectable from "../proxy-functions/shell-api-request/shell-api-request.injectable";
import routerInjectable from "../router/router.injectable";
import lensProxyLoggerInjectable from "./logger.injectable";
import lensProxyPortInjectable from "./port.injectable";
import { LensProxy } from "./proxy";

const lensProxyInjectable = getInjectable({
  instantiate: (di) => new LensProxy({
    appEventBus: di.inject(appEventBusInjectable),
    router: di.inject(routerInjectable),
    getClusterForRequest: di.inject(getClusterForRequestInjectable),
    kubeApiRequest,
    shellApiRequest: di.inject(shellApiRequestInjectable),
    catalogApiRequest: di.inject(catalogApiRequestHandlerInjectable),
    logger: di.inject(lensProxyLoggerInjectable),
    proxyPort: di.inject(lensProxyPortInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default lensProxyInjectable;
