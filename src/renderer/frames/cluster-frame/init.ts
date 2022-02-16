/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { Cluster } from "../../../common/clusters/cluster";
import type { CatalogEntityRegistry } from "../../catalog/entity/registry";
import { Terminal } from "../../components/dock/terminal/terminal";
import type { KubernetesCluster } from "../../../common/catalog/entity/declarations";
import type { AppEvent } from "../../../common/app-event-bus/event-bus";
import type { CatalogEntity } from "../../../common/catalog/entity/entity";
import { when } from "mobx";
import { unmountComponentAtNode } from "react-dom";
import type { ClusterFrameContext } from "../../cluster-frame-context/cluster-frame-context";
import { KubeObjectStore } from "../../../common/k8s-api/kube-object.store";
import { requestSetClusterFrameId } from "../../ipc";
import type { ErrorNotification } from "../../components/notifications/error.injectable";
import type { LensLogger } from "../../../common/logger";

interface Dependencies {
  hostedCluster: Cluster;
  loadExtensions: (getCluster: () => CatalogEntity) => void;
  catalogEntityRegistry: CatalogEntityRegistry;
  frameRoutingId: number;
  emitEvent: (event: AppEvent) => void;

  // TODO: This dependency belongs to KubeObjectStore
  clusterFrameContext: ClusterFrameContext;
  errorNotification: ErrorNotification;
  logger: LensLogger;
}

export const initClusterFrame = ({
  hostedCluster,
  loadExtensions,
  catalogEntityRegistry,
  frameRoutingId,
  emitEvent,
  clusterFrameContext,
  errorNotification,
  logger,
}: Dependencies) => (
  async (rootElem: HTMLElement) => {
    logger.info(`Init dashboard, clusterId=${hostedCluster.id}, frameId=${frameRoutingId}`);

    await Terminal.preloadFonts();
    await requestSetClusterFrameId(hostedCluster.id);
    await hostedCluster.whenReady; // cluster.activate() is done at this point

    catalogEntityRegistry.setActiveEntity(hostedCluster.id);

    // Only load the extensions once the catalog has been populated.
    // Note that the Catalog might still have unprocessed entities until the extensions are fully loaded.
    when(
      () => catalogEntityRegistry.entities.get().length > 0,
      () =>
        loadExtensions(() => catalogEntityRegistry.activeEntity.get() as KubernetesCluster),
      {
        timeout: 15_000,
        onError: (error) => {
          console.warn("[CLUSTER-FRAME]: error from activeEntity when()", error);
          errorNotification("Failed to get KubernetesCluster for this view. Extensions will not be loaded.");
        },
      },
    );

    setTimeout(() => {
      emitEvent({
        name: "cluster",
        action: "open",
        params: {
          clusterId: hostedCluster.id,
        },
      });
    });

    window.addEventListener("online", () => {
      window.location.reload();
    });

    window.onbeforeunload = () => {
      logger.info(`Unload dashboard, clusterId=${(hostedCluster.id)}, frameId=${frameRoutingId}`);

      unmountComponentAtNode(rootElem);
    };

    // TODO: Make context dependency of KubeObjectStore
    KubeObjectStore.defaultContext.set(clusterFrameContext);
  }
);
