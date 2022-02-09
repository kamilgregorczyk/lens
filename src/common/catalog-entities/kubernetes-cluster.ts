/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { catalogCategoryRegistry } from "../catalog/catalog-category-registry";
import { CatalogEntity, CatalogEntityActionContext, CatalogEntityContextMenuContext, CatalogEntityMetadata, CatalogEntityStatus, CatalogCategory, CatalogCategorySpec } from "../catalog";
import { broadcastMessage } from "../ipc";
import type { CatalogEntitySpec } from "../catalog/catalog-entity";
import { IpcRendererNavigationEvents } from "../../renderer/navigation/events";
import { requestClusterDisconnection } from "../../renderer/ipc";
import { activateClusterInjectionToken } from "../ipc/cluster-activate.token";
import { disconnectClusterInjectionToken } from "../ipc/cluster-disconnect.token";
import { asLegacyGlobalChannelForExtensionApi } from "../../extensions/di-legacy-globals/as-legacy-global-channel-for-extension-api";

export interface KubernetesClusterPrometheusMetrics {
  address?: {
    namespace: string;
    service: string;
    port: number;
    prefix: string;
  };
  type?: string;
}

export interface KubernetesClusterSpec extends CatalogEntitySpec {
  kubeconfigPath: string;
  kubeconfigContext: string;
  metrics?: {
    source: string;
    prometheus?: KubernetesClusterPrometheusMetrics;
  };
  icon?: {
    // TODO: move to CatalogEntitySpec once any-entity icons are supported
    src?: string;
    material?: string;
    background?: string;
  };
  accessibleNamespaces?: string[];
}

export enum LensKubernetesClusterStatus {
  DELETING = "deleting",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
}

export interface KubernetesClusterMetadata extends CatalogEntityMetadata {
  distro?: string;
  kubeVersion?: string;
}

/**
 * @deprecated This is no longer used as it is incorrect. Other sources can add more values
 */
export type KubernetesClusterStatusPhase = "connected" | "connecting" | "disconnected" | "deleting";

export interface KubernetesClusterStatus extends CatalogEntityStatus {
}

const activateCluster = asLegacyGlobalChannelForExtensionApi(activateClusterInjectionToken);
const disconnectCluster = asLegacyGlobalChannelForExtensionApi(disconnectClusterInjectionToken);

export class KubernetesCluster<
  Metadata extends KubernetesClusterMetadata = KubernetesClusterMetadata,
  Status extends KubernetesClusterStatus = KubernetesClusterStatus,
  Spec extends KubernetesClusterSpec = KubernetesClusterSpec,
> extends CatalogEntity<Metadata, Status, Spec> {
  public static readonly apiVersion: string = "entity.k8slens.dev/v1alpha1";
  public static readonly kind: string = "KubernetesCluster";

  public readonly apiVersion = KubernetesCluster.apiVersion;
  public readonly kind = KubernetesCluster.kind;

  async connect(): Promise<void> {
    await activateCluster(this.getId());
  }

  async disconnect(): Promise<void> {
    await disconnectCluster(this.getId());
  }

  async onRun(context: CatalogEntityActionContext) {
    context.navigate(`/cluster/${this.getId()}`);
  }

  onDetailsOpen(): void {
    //
  }

  onSettingsOpen(): void {
    //
  }

  async onContextMenuOpen(context: CatalogEntityContextMenuContext) {
    if (!this.metadata.source || this.metadata.source === "local") {
      context.menuItems.push({
        title: "Settings",
        icon: "settings",
        onClick: () => broadcastMessage(
          IpcRendererNavigationEvents.NAVIGATE_IN_APP,
          `/entity/${this.getId()}/settings`,
        ),
      });
    }

    switch (this.status.phase) {
      case LensKubernetesClusterStatus.CONNECTED:
      case LensKubernetesClusterStatus.CONNECTING:
        context.menuItems.push({
          title: "Disconnect",
          icon: "link_off",
          onClick: () => requestClusterDisconnection(this.getId()),
        });
        break;
      case LensKubernetesClusterStatus.DISCONNECTED:
        context.menuItems.push({
          title: "Connect",
          icon: "link",
          onClick: () => context.navigate(`/cluster/${this.getId()}`),
        });
        break;
    }

    catalogCategoryRegistry
      .getCategoryForEntity<KubernetesClusterCategory>(this)
      ?.emit("contextMenuOpen", this, context);
  }
}

class KubernetesClusterCategory extends CatalogCategory {
  public readonly apiVersion = "catalog.k8slens.dev/v1alpha1";
  public readonly kind = "CatalogCategory";
  public metadata = {
    name: "Clusters",
    icon: require(`!!raw-loader!./icons/kubernetes.svg`).default, // eslint-disable-line
  };
  public spec: CatalogCategorySpec = {
    group: "entity.k8slens.dev",
    versions: [
      {
        name: "v1alpha1",
        entityClass: KubernetesCluster,
      },
    ],
    names: {
      kind: "KubernetesCluster",
    },
  };
}

export const kubernetesClusterCategory = new KubernetesClusterCategory();

catalogCategoryRegistry.add(kubernetesClusterCategory);
