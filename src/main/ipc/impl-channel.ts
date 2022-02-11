/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { DependencyInjectionContainer, Injectable, InjectionToken } from "@ogre-tools/injectable";
import type { IpcMainEvent, IpcMainInvokeEvent } from "electron";
import type { Channel, ChannelCallable } from "../../common/ipc/channel";
import { toJS } from "../../common/utils";
import onInjectable from "./on.injectable";
import rawOnInjectable from "./raw-on.injectable";
import handleInjectable from "./handle.injectable";
import rawHandleInjectable from "./raw-handle.injectable";

export type ChannelInit<Args extends any[], R = void> = (di: DependencyInjectionContainer) => (...args: Args) => R;

export function implWithOn<Args extends any[]>(channelToken: Channel<Args, void>, init: ChannelInit<Args>) {
  return channelToken.getInjectable((di, channel) => {
    const on = di.inject(onInjectable);
    const listener = init(di);

    on(channel, (...args) => listener(...args.map(toJS) as Args));

    return listener;
  }) as Injectable<InjectionToken<ChannelCallable<Channel<Args, void>>, void>, ChannelCallable<Channel<Args, void>>, void>;
}

export function implWithRawOn<Args extends any[]>(channelToken: Channel<Args, void>, init: ChannelInit<[IpcMainEvent, ...Args]>) {
  return channelToken.getInjectable((di, channel) => {
    const rawOn = di.inject(rawOnInjectable);
    const listener = init(di);

    rawOn(channel, (event, ...args) => listener(event, ...args.map(toJS) as Args));

    return () => {
      throw new Error(`Directly calling IPC listener ${channel} on main is invalid`);
    };
  }) as Injectable<InjectionToken<ChannelCallable<Channel<Args, void>>, void>, ChannelCallable<Channel<Args, void>>, void>;
}

export function implWithHandle<Args extends any[], R extends Promise<any>>(channelToken: Channel<Args, R>, init: ChannelInit<Args, R>) {
  return channelToken.getInjectable((di, channel) => {
    const handle = di.inject(handleInjectable);
    const listener = init(di);

    handle(channel, (...args) => listener(...args.map(toJS) as Args));

    return listener;
  }) as Injectable<InjectionToken<ChannelCallable<Channel<Args, R>>, void>, ChannelCallable<Channel<Args, R>>, void>;
}

export function implWithRawHandle<Args extends any[], R extends Promise<any>>(channelToken: Channel<Args, R>, init: ChannelInit<[IpcMainInvokeEvent, ...Args], R>) {
  return channelToken.getInjectable((di, channel) => {
    const rawHandle = di.inject(rawHandleInjectable);
    const listener = init(di);

    rawHandle(channel, (event, ...args) => listener(event, ...args.map(toJS) as Args));

    return () => {
      throw new Error(`Directly calling IPC channel ${channel} on main is invalid`);
    };
  }) as Injectable<InjectionToken<ChannelCallable<Channel<Args, R>>, void>, ChannelCallable<Channel<Args, R>>, void>;
}
