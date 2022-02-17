/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { SemVer } from "semver";
import { version } from "../../../package.json";

const appVersionInjectable = getInjectable({
  instantiate: () => new SemVer(version),
  lifecycle: lifecycleEnum.singleton,
});

export default appVersionInjectable;
