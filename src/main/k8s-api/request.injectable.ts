/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { JsonObject } from "type-fest";
import type { Cluster } from "../../common/cluster/cluster";
import lensProxyPortInjectable, { LensProxyPort } from "../lens-proxy/port.injectable";
import request, { RequestPromiseOptions } from "request-promise-native";
import { apiKubePrefix } from "../../common/vars";

export type K8sRequest = (cluster: Cluster, path: string, options?: RequestPromiseOptions) => Promise<JsonObject>;

interface Dependencies {
  proxyPort: LensProxyPort;
}

const k8sRequest = ({ proxyPort }: Dependencies): K8sRequest => (
  (cluster, path, options = {}) => {
    const kubeProxyUrl = `http://localhost:${proxyPort.get()}${apiKubePrefix}`;

    options.headers ??= {};
    options.timeout ??= 30000;
    options.json = true; // for JSON
    options.headers.Host = `${cluster.id}.${new URL(kubeProxyUrl).host}`; // required in ClusterManager.getClusterForRequest()

    return request(kubeProxyUrl + path, options);
  }
);

const k8sRequestInjectable = getInjectable({
  instantiate: (di) => k8sRequest({
    proxyPort: di.inject(lensProxyPortInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default k8sRequestInjectable;
