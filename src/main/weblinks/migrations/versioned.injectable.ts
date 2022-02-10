/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { joinMigrations } from "../../utils/join-migrations";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";

import version514 from "./5.1.4";

const versionedMigrationsInjectable = getInjectable({
  instantiate: () => joinMigrations(
    version514,
  ),
  lifecycle: lifecycleEnum.singleton,
});

export default versionedMigrationsInjectable;

