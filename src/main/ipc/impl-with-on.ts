/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { DependencyInjectionContainer, Injectable, InjectionToken } from "@ogre-tools/injectable";
import type { IpcMainEvent } from "electron";
import type { Channel, ChannelCallable } from "../../common/ipc/channel";
import { toJS } from "../../common/utils";
import onInjectable from "./on.injectable";
import rawOnInjectable from "./raw-on.injectable";

type ChannelInit<Args extends any[]> = (di: DependencyInjectionContainer) => (...args: Args) => void;

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
