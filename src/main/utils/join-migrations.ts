/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type Conf from "conf";
import type { Migrations } from "conf/dist/source/types";
import logger from "../../common/logger";
import { ExtendedMap, iter } from "../../common/utils";
import { isTestEnv } from "../../common/vars";

function migrationLog(message: string, meta?: any) {
  if (!isTestEnv) {
    logger.info(message, meta);
  }
}

export type Migration = (log: (message: string, meta?: any) => void, store: Conf<any>) => void;

export interface MigrationDeclaration {
  version: string,
  run: Migration;
}

export function joinMigrations(...declarations: MigrationDeclaration[]): Migrations<any> {
  const migrations = new ExtendedMap<string, Migration[]>();

  for (const decl of declarations) {
    migrations.getOrInsert(decl.version, () => []).push(decl.run);
  }

  return Object.fromEntries(
    iter.map(
      migrations,
      ([v, fns]) => [v, (store: Conf<any>) => {
        migrationLog(`Running ${v} migration for ${store.path}`);

        for (const fn of fns) {
          fn(migrationLog, store);
        }
      }],
    ),
  );
}
