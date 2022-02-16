/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { getAppVersionFromProxyServer } from "../../common/utils";
import lensProxyPortInjectable from "./port.injectable";

const getAppVersionFromProxyInjectable = getInjectable({
  instantiate: (di) => {
    const proxyPort = di.inject(lensProxyPortInjectable);

    return () => getAppVersionFromProxyServer(proxyPort.get());
  },
  lifecycle: lifecycleEnum.singleton,
});

export default getAppVersionFromProxyInjectable;
