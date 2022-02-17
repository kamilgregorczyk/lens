/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import path from "path";
import directoryForUserDataInjectable from "./user-data.injectable";

const extensionsNodeModulesDirectoryInjectable = getInjectable({
  instantiate: (di) => path.join(
    di.inject(directoryForUserDataInjectable),
    "node_modules",
  ),
  lifecycle: lifecycleEnum.singleton,
});

export default extensionsNodeModulesDirectoryInjectable;
