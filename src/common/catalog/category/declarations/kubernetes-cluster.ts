/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubernetesCluster } from "../../entity/declarations";
import { CatalogCategory, CatalogCategorySpec } from "../category";

export class KubernetesClusterCategory extends CatalogCategory {
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
