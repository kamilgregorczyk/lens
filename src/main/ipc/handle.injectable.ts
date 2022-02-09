/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { RawHandle } from "./raw-handle.injectable";
import rawHandleInjectable from "./raw-handle.injectable";

export type Handle = (channel: string, listener: (...args: any[]) => any) => void;

interface Dependencies {
  rawHandle: RawHandle;
}

const handle = ({ rawHandle }: Dependencies): Handle => (
  (channel, listener) => rawHandle(channel, (event, ...args) => listener(...args))
);

const handleInjectable = getInjectable({
  instantiate: (di) => handle({
    rawHandle: di.inject(rawHandleInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default handleInjectable;
