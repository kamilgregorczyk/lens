/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import path from "path";
import extensionsNodeModulesDirectoryInjectable from "../../../common/paths/node-modules.injectable";

export type GetInstallPath = (extName: string) => string;

interface Dependencies {
  extensionsNodeModulesDirectory: string;
}

const getInstallPath = ({ extensionsNodeModulesDirectory }: Dependencies): GetInstallPath => (
  (name) => path.join(extensionsNodeModulesDirectory, name)
);

const getInstallPathInjectable = getInjectable({
  instantiate: (di) => getInstallPath({
    extensionsNodeModulesDirectory: di.inject(extensionsNodeModulesDirectoryInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getInstallPathInjectable;
