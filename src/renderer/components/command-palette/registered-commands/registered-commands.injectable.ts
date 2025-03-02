/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
import type { CustomResourceDefinition } from "../../../../common/k8s-api/endpoints";
import customResourceDefinitionsInjectable from "../../+custom-resources/custom-resources.injectable";
import type { LensRendererExtension } from "../../../../extensions/lens-renderer-extension";
import rendererExtensionsInjectable from "../../../../extensions/renderer-extensions.injectable";
import type { CommandRegistration, RegisteredCommand } from "./commands";
import internalCommandsInjectable, { isKubernetesClusterActive } from "./internal-commands.injectable";

interface Dependencies {
  extensions: IComputedValue<LensRendererExtension[]>;
  customResourceDefinitions: IComputedValue<CustomResourceDefinition[]>;
  internalCommands: CommandRegistration[];
}

const instantiateRegisteredCommands = ({ extensions, customResourceDefinitions, internalCommands }: Dependencies) => computed(() => {
  const result = new Map<string, RegisteredCommand>();
  const commands = [
    ...internalCommands,
    ...extensions.get().flatMap(e => e.commands),
    ...customResourceDefinitions.get().map((command): CommandRegistration => ({
      id: `cluster.view.${command.getResourceKind()}`,
      title: `Cluster: View ${command.getResourceKind()}`,
      isActive: isKubernetesClusterActive,
      action: ({ navigate }) => navigate(command.getResourceUrl()),
    })),
  ];

  for (const { scope, isActive = () => true, ...command } of commands) {
    if (!result.has(command.id)) {
      result.set(command.id, { ...command, isActive });
    }
  }

  return result;
});

const registeredCommandsInjectable = getInjectable({
  instantiate: (di) => instantiateRegisteredCommands({
    extensions: di.inject(rendererExtensionsInjectable),
    customResourceDefinitions: di.inject(customResourceDefinitionsInjectable),
    internalCommands: di.inject(internalCommandsInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default registeredCommandsInjectable;
