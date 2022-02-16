/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

// Cleans up a store that had the state related data stored
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createHotbarInjectable, { CreateHotbar } from "../../../common/hotbars/create-hotbar.injectable";
import { catalogEntity } from "../../catalog/local-sources/general/view-catalog-entity";
import type { MigrationDeclaration } from "../../utils/join-migrations";

interface Dependencies {
  createHotbar: CreateHotbar;
}

const v500Alpha0Migration = ({ createHotbar }: Dependencies): MigrationDeclaration => ({
  version: "5.0.0-alpha.0",
  run(log, store) {
    const [id, hotbar] = createHotbar({ name: "default" });
    const { metadata: { uid, name, source }} = catalogEntity;

    hotbar.items[0] = { entity: { uid, name, source }};

    store.set("hotbars", [{ id, ...hotbar }]);
  },
});

const v500Alpha0MigrationInjectable = getInjectable({
  instantiate: (di) => v500Alpha0Migration({
    createHotbar: di.inject(createHotbarInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default v500Alpha0MigrationInjectable;
