/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React from "react";
import type { LensProtocolRouterRenderer } from "./router";
import { EXTENSION_NAME_MATCH, EXTENSION_PUBLISHER_MATCH, LensProtocolRouter } from "../../common/protocol-handler/router";
import * as routes from "../../common/routes";
import type { ExtensionInfo } from "../components/+extensions/attempt-install-by-info/attempt-install-by-info";
import type { Navigate } from "../navigation/navigate.injectable";
import type { GetEntityById } from "../../common/catalog/entity/get-by-id.injectable";
import type { GetClusterById } from "../../common/clusters/get-by-id.injectable";
import type { ShortInfoNotification } from "../components/notifications/short-info.injectable";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import attemptInstallByInfoInjectable from "../components/+extensions/attempt-install-by-info/attempt-install-by-info.injectable";
import getClusterByIdInjectable from "../../common/clusters/get-by-id.injectable";
import getEntityByIdInjectable from "../../common/catalog/entity/get-by-id.injectable";
import navigateInjectable from "../navigation/navigate.injectable";
import shortInfoNotificationInjectable from "../components/notifications/short-info.injectable";
import lensProtocolRouterRendererInjectable from "./router.injectable";

interface Dependencies {
  attemptInstallByInfo: (extensionInfo: ExtensionInfo) => Promise<void>;
  router: LensProtocolRouterRenderer;
  navigate: Navigate;
  getEntityById: GetEntityById;
  getClusterById: GetClusterById;
  shortInfoNotification: ShortInfoNotification;
}

const addRouteHandlers = ({
  attemptInstallByInfo,
  getEntityById,
  getClusterById,
  navigate,
  shortInfoNotification,
  router,
}: Dependencies) => {
  router
    .addInternalHandler("/preferences", ({ search: { highlight }}) => {
      navigate(routes.preferencesURL({ fragment: highlight }));
    })
    .addInternalHandler("/", ({ tail }) => {
      if (tail) {
        shortInfoNotification(
          <p>
              Unknown Action for <code>lens://app/{tail}</code>. Are you on the
              latest version?
          </p>,
        );
      }

      navigate(routes.catalogURL());
    })
    .addInternalHandler("/landing", () => {
      navigate(routes.catalogURL());
    })
    .addInternalHandler(
      "/landing/view/:group/:kind",
      ({ pathname: { group, kind }}) => {
        navigate(
          routes.catalogURL({
            params: {
              group,
              kind,
            },
          }),
        );
      },
    )
    .addInternalHandler("/cluster", () => {
      navigate(routes.addClusterURL());
    })
    .addInternalHandler(
      "/entity/:entityId/settings",
      ({ pathname: { entityId }}) => {
        const entity = getEntityById(entityId);

        if (entity) {
          navigate(routes.entitySettingsURL({ params: { entityId }}));
        } else {
          shortInfoNotification(
            <p>
                Unknown catalog entity <code>{entityId}</code>.
            </p>,
          );
        }
      },
    )
  // Handlers below are deprecated and only kept for backward compact purposes
    .addInternalHandler(
      "/cluster/:clusterId",
      ({ pathname: { clusterId }}) => {
        const cluster = getClusterById(clusterId);

        if (cluster) {
          navigate(routes.clusterViewURL({ params: { clusterId }}));
        } else {
          shortInfoNotification(
            <p>
                Unknown catalog entity <code>{clusterId}</code>.
            </p>,
          );
        }
      },
    )
    .addInternalHandler(
      "/cluster/:clusterId/settings",
      ({ pathname: { clusterId }}) => {
        const cluster = getClusterById(clusterId);

        if (cluster) {
          navigate(
            routes.entitySettingsURL({ params: { entityId: clusterId }}),
          );
        } else {
          shortInfoNotification(
            <p>
                Unknown catalog entity <code>{clusterId}</code>.
            </p>,
          );
        }
      },
    )
    .addInternalHandler("/extensions", () => {
      navigate(routes.extensionsURL());
    })
    .addInternalHandler(
      `/extensions/install${LensProtocolRouter.ExtensionUrlSchema}`,
      ({ pathname, search: { version }}) => {
        const name = [
          pathname[EXTENSION_PUBLISHER_MATCH],
          pathname[EXTENSION_NAME_MATCH],
        ]
          .filter(Boolean)
          .join("/");

        navigate(routes.extensionsURL());
        attemptInstallByInfo({ name, version, requireConfirmation: true });
      },
    );
};

const protocolRouteHandlersInjectable = getInjectable({
  setup: (di) => {
    addRouteHandlers({
      attemptInstallByInfo: di.inject(attemptInstallByInfoInjectable),
      getClusterById: di.inject(getClusterByIdInjectable),
      getEntityById: di.inject(getEntityByIdInjectable),
      navigate: di.inject(navigateInjectable),
      shortInfoNotification: di.inject(shortInfoNotificationInjectable),
      router: di.inject(lensProtocolRouterRendererInjectable),
    });
  },
  instantiate: () => undefined,
  lifecycle: lifecycleEnum.singleton,
});

export default protocolRouteHandlersInjectable;

