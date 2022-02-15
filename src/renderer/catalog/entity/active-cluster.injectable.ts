/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
import type { Cluster } from "../../../common/clusters/cluster";
import type { GetClusterById } from "../../../common/clusters/get-by-id.injectable";
import getClusterByIdInjectable from "../../../common/clusters/get-by-id.injectable";
import type { CatalogEntityRegistry } from "./registry";
import catalogEntityRegistryInjectable from "./registry.injectable";

interface Dependencies {
  registry: CatalogEntityRegistry;
  getClusterById: GetClusterById;
}

const activeClusterEntity = ({ registry, getClusterById }: Dependencies): IComputedValue<Cluster> => (
  computed(() => getClusterById(registry.activeEntity.get()?.getId()))
);

const activeClusterEntityInjectable = getInjectable({
  instantiate: (di) => activeClusterEntity({
    registry: di.inject(catalogEntityRegistryInjectable),
    getClusterById: di.inject(getClusterByIdInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default activeClusterEntityInjectable;
