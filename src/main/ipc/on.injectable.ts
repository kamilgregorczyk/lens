/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { RawOn } from "./raw-on.injectable";
import rawOnInjectable from "./raw-on.injectable";

export type On = (channel: string, listener: (...args: any[]) => void) => void;

interface Dependencies {
  rawOn: RawOn;
}

const on = ({ rawOn }: Dependencies): On => (
  (channel, listener) => rawOn(channel, (event, ...args) => listener(...args))
);

const onInjectable = getInjectable({
  instantiate: (di) => on({
    rawOn: di.inject(rawOnInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default onInjectable;
