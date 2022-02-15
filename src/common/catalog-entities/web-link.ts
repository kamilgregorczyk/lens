/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { CatalogEntity, CatalogEntityMetadata, CatalogEntityStatus } from "../catalog/entity/entity";
import { CatalogCategory } from "../catalog/category";

export type WebLinkStatusPhase = "available" | "unavailable";

export interface WebLinkStatus extends CatalogEntityStatus {
  phase: WebLinkStatusPhase;
}

export type WebLinkSpec = {
  url: string;
};

export class WebLink extends CatalogEntity<CatalogEntityMetadata, WebLinkStatus, WebLinkSpec> {
  public static readonly apiVersion = "entity.k8slens.dev/v1alpha1";
  public static readonly kind = "WebLink";

  public readonly apiVersion = WebLink.apiVersion;
  public readonly kind = WebLink.kind;

  async onRun() {
    window.open(this.spec.url, "_blank");
  }

  // async onContextMenuOpen(context: CatalogEntityContextMenuContext) {
  //   if (this.metadata.source === "local") {
  //     context.menuItems.push({
  //       title: "Delete",
  //       icon: "delete",
  //       onClick: async () => WeblinkStore.getInstance().removeById(this.getId()),
  //       confirm: {
  //         message: `Remove Web Link "${this.getName()}" from ${productName}?`,
  //       },
  //     });
  //   }
  // }
}

export class WebLinkCategory extends CatalogCategory {
  public readonly apiVersion = "catalog.k8slens.dev/v1alpha1";
  public readonly kind = "CatalogCategory";
  public metadata = {
    name: "Web Links",
    icon: "public",
  };
  public spec = {
    group: "entity.k8slens.dev",
    versions: [
      {
        name: "v1alpha1",
        entityClass: WebLink,
      },
    ],
    names: {
      kind: "WebLink",
    },
  };
}
