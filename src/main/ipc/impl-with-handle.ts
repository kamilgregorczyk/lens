/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { DependencyInjectionContainer, Injectable, InjectionToken } from "@ogre-tools/injectable";
import type { IpcMainInvokeEvent } from "electron/main";
import type { Channel, ChannelCallable } from "../../common/ipc/channel";
import handleInjectable from "./handle.injectable";
import rawHandleInjectable from "./raw-handle.injectable";

type ChannelInit<Args extends any[], R> = (di: DependencyInjectionContainer) => (...args: Args) => Promise<R>;

export function implWithHandle<Args extends any[], R>(channelToken: Channel<Args, R>, init: ChannelInit<Args, R>) {
  return channelToken.getInjectable((di, channel) => {
    const handle = di.inject(handleInjectable);
    const listener = init(di);

    handle(channel, listener);

    return listener;
  }) as Injectable<InjectionToken<ChannelCallable<Channel<Args, R>>, void>, ChannelCallable<Channel<Args, R>>, void>;
}

export function implWithRawHandle<Args extends any[], R>(channelToken: Channel<Args, R>, init: ChannelInit<[IpcMainInvokeEvent, ...Args], R>) {
  return channelToken.getInjectable((di, channel) => {
    const rawHandle = di.inject(rawHandleInjectable);
    const listener = init(di);

    rawHandle(channel, listener);

    return () => {
      throw new Error(`Directly calling IPC channel ${channel} on main is invalid`);
    };
  }) as Injectable<InjectionToken<ChannelCallable<Channel<Args, R>>, void>, ChannelCallable<Channel<Args, R>>, void>;
}
