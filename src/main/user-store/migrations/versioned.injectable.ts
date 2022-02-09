/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

// User store migrations

import { joinMigrations } from "../../utils/join-migrations";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";

import version210Beta4 from "./2.1.0-beta.4";
import version500Alpha3 from "./5.0.0-alpha.3";
import v503Beta1MigrationInjectable from "./5.0.3-beta.1.injectable";

const versionedMigrationsInjectable = getInjectable({
  instantiate: (di) => joinMigrations(
    version210Beta4,
    version500Alpha3,
    di.inject(v503Beta1MigrationInjectable),
  ),
  lifecycle: lifecycleEnum.singleton,
});

export default versionedMigrationsInjectable;

