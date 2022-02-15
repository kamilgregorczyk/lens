/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { DependencyInjectionContainer } from "@ogre-tools/injectable";
import { toJS } from "mobx";
import type { Channel } from "../../common/ipc/channel";
import ipcRendererInjectable from "./ipc-renderer.injectable";

export type ChannelInit<Args extends any[], R = void> = (di: DependencyInjectionContainer) => (...args: Args) => R;

export function implWithOn<Args extends any[]>(channelToken: Channel<Args, void>, init: ChannelInit<Args>, allowLocal?: boolean) {
  return channelToken.getInjectable((di, channel) => {
    const ipcRenderer = di.inject(ipcRendererInjectable);
    const listener = init(di);

    ipcRenderer.on(channel, (event, ...args) => listener(...args.map(toJS) as Args));

    return listener;
  }, allowLocal);
}
