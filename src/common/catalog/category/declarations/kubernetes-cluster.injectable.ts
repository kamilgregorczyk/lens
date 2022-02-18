/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { addCatalogCategoryInjectionToken } from "../add-category.token";
import { KubernetesClusterCategory } from "./kubernetes-cluster";

const kubernetesClusterCategoryInjectable = getInjectable({
  instantiate: (di) => {
    const addCatalogCategory = di.inject(addCatalogCategoryInjectionToken);
    const kubernetesClusterCategory = new KubernetesClusterCategory();

    addCatalogCategory(kubernetesClusterCategory);

    return kubernetesClusterCategory;
  },
  lifecycle: lifecycleEnum.singleton,
});

export default kubernetesClusterCategoryInjectable;
