/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import path from "path";
import directoryForKubeConfigsInjectable from "./local-kube-configs.injectable";

export type GetCustomKubeConfigDirectory = (dirName: string) => string;

interface Dependencies {
  directoryForKubeConfigs: string;
}

const getCustomKubeConfigDirectory = ({ directoryForKubeConfigs }: Dependencies): GetCustomKubeConfigDirectory => (
  (dirName) => path.resolve(directoryForKubeConfigs, dirName)
);

const getCustomKubeConfigDirectoryInjectable = getInjectable({
  instantiate: (di) => getCustomKubeConfigDirectory({
    directoryForKubeConfigs: di.inject(directoryForKubeConfigsInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getCustomKubeConfigDirectoryInjectable;
