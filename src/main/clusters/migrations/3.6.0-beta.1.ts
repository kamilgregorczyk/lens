/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

// Move embedded kubeconfig into separate file and add reference to it to cluster settings
// convert file path cluster icons to their base64 encoded versions

import path from "path";
import fse from "fs-extra";
import { loadConfigFromFileSync } from "../../../common/kube-helpers";
import type { MigrationDeclaration } from "../../utils/join-migrations";
import type { ClusterModel } from "../../../common/cluster-types";
import directoryForUserDataInjectable from "../../../common/paths/user-data.injectable";
import directoryForKubeConfigsInjectable from "../../../common/paths/local-kube-configs.injectable";
import getCustomKubeConfigDirectoryInjectable, { GetCustomKubeConfigDirectory } from "../../../common/paths/get-custom-kube-config-directory.injectable";

interface Pre360ClusterModel extends ClusterModel {
  kubeConfig: string;
}

interface Dependencies {
  userDataPath: string;
  kubeConfigsPath: string;
  getCustomKubeConfigDirectory: GetCustomKubeConfigDirectory;
}

const v360Beta1Migration = ({ userDataPath, kubeConfigsPath, getCustomKubeConfigDirectory }: Dependencies): MigrationDeclaration => ({
  version: "3.6.0-beta.1",
  run(log, store) {
    const storedClusters: Pre360ClusterModel[] = store.get("clusters") ?? [];
    const migratedClusters: ClusterModel[] = [];

    fse.ensureDirSync(kubeConfigsPath);

    log("Number of clusters to migrate: ", storedClusters.length);

    for (const clusterModel of storedClusters) {
      /**
       * migrate kubeconfig
       */
      try {
        const absPath = getCustomKubeConfigDirectory(clusterModel.id);

        // take the embedded kubeconfig and dump it into a file
        fse.writeFileSync(absPath, clusterModel.kubeConfig, { encoding: "utf-8", mode: 0o600 });

        clusterModel.kubeConfigPath = absPath;
        clusterModel.contextName = loadConfigFromFileSync(clusterModel.kubeConfigPath).config.getCurrentContext();
        delete clusterModel.kubeConfig;

      } catch (error) {
        log(`Failed to migrate Kubeconfig for cluster "${clusterModel.id}", removing clusterModel...`, error);

        continue;
      }

      /**
       * migrate cluster icon
       */
      try {
        if (clusterModel.preferences?.icon) {
          log(`migrating ${clusterModel.preferences.icon} for ${clusterModel.preferences.clusterName}`);
          const iconPath = clusterModel.preferences.icon.replace("store://", "");
          const fileData = fse.readFileSync(path.join(userDataPath, iconPath));

          clusterModel.preferences.icon = `data:;base64,${fileData.toString("base64")}`;
        } else {
          delete clusterModel.preferences?.icon;
        }
      } catch (error) {
        log(`Failed to migrate cluster icon for cluster "${clusterModel.id}"`, error);
        delete clusterModel.preferences.icon;
      }

      migratedClusters.push(clusterModel);
    }

    store.set("clusters", migratedClusters);
  },
});

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";

const v360Beta1MigrationInjectable = getInjectable({
  instantiate: (di) => v360Beta1Migration({
    userDataPath: di.inject(directoryForUserDataInjectable),
    kubeConfigsPath: di.inject(directoryForKubeConfigsInjectable),
    getCustomKubeConfigDirectory: di.inject(getCustomKubeConfigDirectoryInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default v360Beta1MigrationInjectable;
