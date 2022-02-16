/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { Disposer } from "../../../common/utils";
import type { CatalogEntityRegistry, EntitySource } from "./registry";
import catalogEntityRegistryInjectable from "./registry.injectable";

export type AddComputedSource = (src: EntitySource) => Disposer;

interface Dependencies {
  registry: CatalogEntityRegistry;
}

const addComputedSource = ({ registry }: Dependencies): AddComputedSource => (
  (src) => registry.addComputedSource(src)
);

const addComputedSourceInjectable = getInjectable({
  instantiate: (di) => addComputedSource({
    registry: di.inject(catalogEntityRegistryInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default addComputedSourceInjectable;
