/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { Channel, ChannelCallable } from "../../common/ipc/channel";
import invokeInjectable from "./invoke-main.injectable";
import type { Injectable, InjectionToken } from "@ogre-tools/injectable";
import { toJS } from "../utils";

export function implWithInvoke<Token extends Channel<any[], any>>(channelToken: Token) {
  return channelToken.getInjectable((di, channel) => {
    const invoke = di.inject(invokeInjectable);

    return (...args: any[]) => invoke(channel, ...args.map(toJS));
  }) as Injectable<InjectionToken<ChannelCallable<Token>, void>, ChannelCallable<Token>, void>;
}
