/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { homedir } from "os";
import path from "path";

const localExtensionsDirectoryInjectable = getInjectable({
  instantiate: () => path.join(homedir(), ".k8slens", "extensions"),
  lifecycle: lifecycleEnum.singleton,
});

export default localExtensionsDirectoryInjectable;
