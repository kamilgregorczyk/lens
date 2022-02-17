/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { LensApiRequest } from "../../router";
import { respondJson } from "../../utils/http-responses";
import { PortForward } from "./port-forward";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createPortForwardInjectable, { CreatePortForward } from "./create-port-forward.injectable";
import type { LensLogger } from "../../../common/logger";
import baseLoggerInjectable from "../../logger/base-logger.injectable";

interface Dependencies {
  createPortForward: CreatePortForward;
  logger: LensLogger;
}

const routePortForward = ({
  createPortForward,
  logger,
}: Dependencies) => (
  async (request: LensApiRequest) => {
    const { params, query, response, cluster } = request;
    const { namespace, resourceType, resourceName } = params;
    const port = Number(query.get("port"));
    const forwardPort = Number(query.get("forwardPort"));

    try {
      let portForward = PortForward.getPortforward({
        clusterId: cluster.id,
        kind: resourceType,
        name: resourceName,
        namespace,
        port,
        forwardPort,
      });

      if (!portForward) {
        logger.info(
          `Creating a new port-forward ${namespace}/${resourceType}/${resourceName}:${port}`,
        );

        const thePort =
          0 < forwardPort && forwardPort < 65536 ? forwardPort : 0;

        portForward = createPortForward(await cluster.getProxyKubeconfigPath(), {
          clusterId: cluster.id,
          kind: resourceType,
          namespace,
          name: resourceName,
          port,
          forwardPort: thePort,
        });

        const started = await portForward.start();

        if (!started) {
          logger.error("[PORT-FORWARD-ROUTE]: failed to start a port-forward", {
            namespace,
            port,
            resourceType,
            resourceName,
          });

          return respondJson(
            response,
            {
              message: `Failed to forward port ${port} to ${
                thePort ? forwardPort : "random port"
              }`,
            },
            400,
          );
        }
      }

      respondJson(response, { port: portForward.forwardPort });
    } catch (error) {
      logger.error(
        `[PORT-FORWARD-ROUTE]: failed to open a port-forward: ${error}`,
        { namespace, port, resourceType, resourceName },
      );

      return respondJson(
        response,
        {
          message: `Failed to forward port ${port}`,
        },
        400,
      );
    }
  }
);

const routePortForwardInjectable = getInjectable({
  instantiate: (di) => routePortForward({
    createPortForward: di.inject(createPortForwardInjectable),
    logger: di.inject(baseLoggerInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default routePortForwardInjectable;
