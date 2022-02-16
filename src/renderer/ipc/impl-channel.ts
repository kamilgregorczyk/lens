/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { Channel, ChannelCallable } from "../../common/ipc/channel";
import invokeInjectable from "./invoke-main.injectable";
import type { Injectable, InjectionToken, DependencyInjectionContainer } from "@ogre-tools/injectable";
import { toJS } from "../utils";
import ipcRendererInjectable from "./ipc-renderer.injectable";
import sendInjectable from "./send-to-main.injectable";

export function implWithInvoke<Token extends Channel<any[], any>>(channelToken: Token) {
  return channelToken.getInjectable((di, channel) => {
    const invoke = di.inject(invokeInjectable);

    return (...args: any[]) => invoke(channel, ...args.map(toJS));
  }) as Injectable<InjectionToken<ChannelCallable<Token>, void>, ChannelCallable<Token>, void>;
}

export type ChannelInit<Args extends any[], R = void> = (di: DependencyInjectionContainer) => (...args: Args) => R;

export function implWithOn<Args extends any[]>(channelToken: Channel<Args, void>, init: ChannelInit<Args>, allowLocal?: boolean) {
  return channelToken.getInjectable((di, channel) => {
    const ipcRenderer = di.inject(ipcRendererInjectable);
    const listener = init(di);

    ipcRenderer.on(channel, (event, ...args) => listener(...args.map(toJS) as Args));

    return listener;
  }, allowLocal);
}

export function implWithSend<Token extends Channel<any[], void>>(channelToken: Token) {
  return channelToken.getInjectable((di, channel) => {
    const send = di.inject(sendInjectable);

    return (...args: any[]) => send(channel, ...args.map(toJS));
  }) as Injectable<InjectionToken<ChannelCallable<Token>, void>, ChannelCallable<Token>, void>;
}
