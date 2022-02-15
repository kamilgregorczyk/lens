/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import catalogEntitySyncerInjectable from "./entity-syncer.injectable";
import catalogEntityRegistryInjectable from "./registry.injectable";

const catalogEntityRegistrySyncInjectable = getInjectable({
  setup: (di) => {
    const registry = di.inject(catalogEntityRegistryInjectable);

    registry.startSync(di.inject(catalogEntitySyncerInjectable));
  },
  instantiate: () => undefined,
  lifecycle: lifecycleEnum.singleton,
});

export default catalogEntityRegistrySyncInjectable;
