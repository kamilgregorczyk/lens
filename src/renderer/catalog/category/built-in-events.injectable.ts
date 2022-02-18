/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import kubernetesClusterCategoryInjectable from "../../../common/catalog/category/declarations/kubernetes-cluster.injectable";
import webLinkCatalogCategoryInjectable from "../../../common/catalog/category/declarations/web-link.injectable";
import { addClusterURL } from "../../../common/routes";
import { productName } from "../../../common/vars";
import isLinuxInjectable from "../../../common/vars/is-linux.injectable";
import isWindowsInjectable from "../../../common/vars/is-windows.injectable";
import { PathPicker } from "../../components/path-picker";
import weblinkStoreInjectableInjectable from "../../weblink-store/weblink-store.injectable";
import addSyncEntriesInjectable from "./helpers/add-sync-entries.injectable";

const builtInCategoryEventsInjectable = getInjectable({
  setup: (di) => {
    const kubernetesClusterCategory = di.inject(kubernetesClusterCategoryInjectable);
    const isWindows = di.inject(isWindowsInjectable);
    const isLinux = di.inject(isLinuxInjectable);
    const addSyncEntries = di.inject(addSyncEntriesInjectable);

    kubernetesClusterCategory.on("catalogAddMenu", ctx => {
      ctx.menuItems.push(
        {
          icon: "text_snippet",
          title: "Add from kubeconfig",
          onClick: () => ctx.navigate(addClusterURL()),
        },
      );

      if (isWindows || isLinux) {
        ctx.menuItems.push(
          {
            icon: "create_new_folder",
            title: "Sync kubeconfig folder(s)",
            defaultAction: true,
            onClick: async () => {
              await PathPicker.pick({
                label: "Sync folder(s)",
                buttonLabel: "Sync",
                properties: ["showHiddenFiles", "multiSelections", "openDirectory"],
                onPick: addSyncEntries,
              });
            },
          },
          {
            icon: "note_add",
            title: "Sync kubeconfig file(s)",
            onClick: async () => {
              await PathPicker.pick({
                label: "Sync file(s)",
                buttonLabel: "Sync",
                properties: ["showHiddenFiles", "multiSelections", "openFile"],
                onPick: addSyncEntries,
              });
            },
          },
        );
      } else {
        ctx.menuItems.push(
          {
            icon: "create_new_folder",
            title: "Sync kubeconfig(s)",
            defaultAction: true,
            onClick: async () => {
              await PathPicker.pick({
                label: "Sync file(s)",
                buttonLabel: "Sync",
                properties: ["showHiddenFiles", "multiSelections", "openFile", "openDirectory"],
                onPick: addSyncEntries,
              });
            },
          },
        );
      }
    });

    const webLinkCatalogCategory = di.inject(webLinkCatalogCategoryInjectable);
    const weblinkStore = di.inject(weblinkStoreInjectableInjectable);

    webLinkCatalogCategory.on("contextMenuOpen", (entity, ctx) => {
      if (entity.metadata.source === "local") {
        ctx.menuItems.push({
          title: "Delete",
          icon: "delete",
          onClick: () => weblinkStore.removeById(entity.getId()),
          confirm: {
            message: `Remove Web Link "${entity.getName()}" from ${productName}?`,
          },
        });
      }
    });
  },
  instantiate: () => undefined,
  lifecycle: lifecycleEnum.singleton,
});

export default builtInCategoryEventsInjectable;
