/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

// Cluster store migrations

import { joinMigrations } from "../../utils/join-migrations";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";

import snap from "./snap";
import v500Beta13MigrationInjectable from "./5.0.0-beta.13";
import v500Beta10MigrationInjectable from "./5.0.0-beta.10";
import v360Beta1MigrationInjectable from "./3.6.0-beta.1";

const versionedMigrationsInjectable = getInjectable({
  instantiate: (di) => joinMigrations(
    di.inject(v360Beta1MigrationInjectable),
    di.inject(v500Beta10MigrationInjectable),
    di.inject(v500Beta13MigrationInjectable),
    snap,
  ),
  lifecycle: lifecycleEnum.singleton,
});

export default versionedMigrationsInjectable;

