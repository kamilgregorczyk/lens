/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { IComputedValue } from "mobx";
import type { GetEntityById } from "../../../common/catalog/entity/get-by-id.injectable";
import type { ClusterId } from "../../../common/cluster-types";
import type { ShellEnvModifier } from "./types";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import getEntityByIdInjectable from "../../../common/catalog/entity/get-by-id.injectable";
import shellEnvModifiersInjectable from "./env-modifiers.injectable";

export type TerminalShellEnvModify = (clusterId: ClusterId, env: Record<string, string>) => Record<string, string>;

interface Dependencies {
  modifiers: IComputedValue<ShellEnvModifier[]>;
  getEntityById: GetEntityById;
}

const terminalShellEnvModify = ({ modifiers, getEntityById }: Dependencies): TerminalShellEnvModify => (
  (clusterId, env) => {
    const envModifiers = modifiers.get();
    const entity = getEntityById(clusterId);

    if (entity) {
      const ctx = { catalogEntity: entity };

      // clone it so the passed value is not also modified
      env = JSON.parse(JSON.stringify(env));
      env = envModifiers.reduce((env, modifier) => modifier(ctx, env), env);
    }

    return env;
  }
);

const terminalShellEnvModifyInjectable = getInjectable({
  instantiate: (di) => terminalShellEnvModify({
    getEntityById: di.inject(getEntityByIdInjectable),
    modifiers: di.inject(shellEnvModifiersInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default terminalShellEnvModifyInjectable;

