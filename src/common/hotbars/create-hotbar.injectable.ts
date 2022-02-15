/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { CreateChildLogger } from "../logger/create-child-logger.injectable";
import createChildLoggerInjectable from "../logger/create-child-logger.injectable";
import { Hotbar } from "./hotbar";
import { CreateHotbarData, defaultHotbarCells } from "./hotbar-types";
import { onTooManyHotbarItemsInjectionToken } from "./too-many-items.token";
import * as uuid from "uuid";
import { tuple } from "../utils";

export type CreateHotbar = (data: CreateHotbarData) => [string, Hotbar];

interface Dependencies {
  createChildLogger: CreateChildLogger;
  onTooManyHotbarItems: () => void;
}

const createHotbar = ({ createChildLogger, onTooManyHotbarItems }: Dependencies): CreateHotbar => (
  (data) => {
    const {
      id = uuid.v4(),
      name,
      items = tuple.filled(defaultHotbarCells, null),
    } = data;
    const logger = createChildLogger(`HOTBAR`, { name: data.name });

    return [id, new Hotbar(
      {
        logger,
        onTooManyHotbarItems,
      },
      name,
      items,
    )];
  }
);

const createHotbarInjectable = getInjectable({
  instantiate: (di) => createHotbar({
    createChildLogger: di.inject(createChildLoggerInjectable),
    onTooManyHotbarItems: di.inject(onTooManyHotbarItemsInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default createHotbarInjectable;
