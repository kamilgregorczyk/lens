/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { joinMigrations } from "../../utils/join-migrations";

const versionedMigrationsInjectable = getInjectable({
  instantiate: () => joinMigrations(),
  lifecycle: lifecycleEnum.singleton,
});

export default versionedMigrationsInjectable ;
