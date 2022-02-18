/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { Cluster } from "../../../common/clusters/cluster";
import { Terminal } from "../../components/dock/terminal/terminal";
import type { AppEvent } from "../../../common/app-event-bus/event-bus";
import { unmountComponentAtNode } from "react-dom";
import type { ClusterFrameContext } from "../../cluster-frame-context/cluster-frame-context";
import { KubeObjectStore } from "../../../common/k8s-api/kube-object.store";
import type { LensLogger } from "../../../common/logger";
import type { SetActiveEntity } from "../../catalog/entity/set-active.injectable";
import type { LoadExtensions } from "./load-extensions.injectable";
import type { SetClusterFrameId } from "../../../common/ipc/cluster/set-frame-id.token";

interface Dependencies {
  hostedCluster: Cluster;
  loadExtensions: LoadExtensions;
  setActiveEntity: SetActiveEntity;
  frameRoutingId: number;
  emitEvent: (event: AppEvent) => void;
  setClusterFrameId: SetClusterFrameId;
  logger: LensLogger;

  // TODO: This dependency belongs to KubeObjectStore
  clusterFrameContext: ClusterFrameContext;
}

export const initClusterFrame = ({
  hostedCluster,
  loadExtensions,
  setActiveEntity,
  setClusterFrameId,
  frameRoutingId,
  emitEvent,
  clusterFrameContext,
  logger,
}: Dependencies) => (
  async (rootElem: HTMLElement) => {
    logger.info(`Init dashboard, clusterId=${hostedCluster.id}, frameId=${frameRoutingId}`);

    await Terminal.preloadFonts();
    await setClusterFrameId(hostedCluster.id);
    await hostedCluster.whenReady; // cluster.activate() is done at this point

    setActiveEntity(hostedCluster.id);
    loadExtensions();

    emitEvent({
      name: "cluster",
      action: "open",
      params: {
        clusterId: hostedCluster.id,
      },
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
