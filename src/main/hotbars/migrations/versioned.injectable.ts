/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

// Hotbar store migrations

import { joinMigrations } from "../../utils/join-migrations";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import version500alpha0 from "./5.0.0-alpha.0";
import version500alpha2 from "./5.0.0-alpha.2";
import v500Beta5MigrationInjectable from "./5.0.0-beta.5.injectable";
import v500Beta10MigrationInjectable from "./5.0.0-beta.10";

const versionedMigrationsInjectable = getInjectable({
  instantiate: (di) => joinMigrations(
    version500alpha0,
    version500alpha2,
    di.inject(v500Beta5MigrationInjectable),
    di.inject(v500Beta10MigrationInjectable),
  ),
  lifecycle: lifecycleEnum.singleton,
});

export default versionedMigrationsInjectable;

