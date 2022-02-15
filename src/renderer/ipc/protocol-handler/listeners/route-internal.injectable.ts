/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { emitRouteProtocolInternalInjectionToken } from "../../../../common/ipc/protocol-handler/router-internal.token";
import lensProtocolRouterRendererInjectable from "../../../protocol-handler/router.injectable";
import { implWithOn } from "../../impl-with-on";

const routeProtocolInternalInjectable = implWithOn(emitRouteProtocolInternalInjectionToken, (di) => {
  const router = di.inject(lensProtocolRouterRendererInjectable);

  return (url, attempt) => router.routeInternal(url, attempt);
});

export default routeProtocolInternalInjectable;
