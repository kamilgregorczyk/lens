/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { emitRouteProtocolExternalInjectionToken } from "../../../../common/ipc/protocol-handler/router-external.token";
import lensProtocolRouterRendererInjectable from "../../../protocol-handler/router.injectable";
import { implWithOn } from "../../impl-with-on";

const routeProtocolExternalInjectable = implWithOn(emitRouteProtocolExternalInjectionToken, (di) => {
  const router = di.inject(lensProtocolRouterRendererInjectable);

  return (url, attempt) => router.routeExternal(url, attempt);
});

export default routeProtocolExternalInjectable;
