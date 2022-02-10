/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { Injectable, InjectionToken } from "@ogre-tools/injectable";
import { toJS } from "mobx";
import { broadcastMessageInjectionToken } from "./broadcast/message.token";
import type { Channel, ChannelCallable } from "./channel";

export function implWithBroadcast<Token extends Channel<any[], void>>(channelToken: Token) {
  return channelToken.getInjectable((di, channel) => {
    const broadcastMessage = di.inject(broadcastMessageInjectionToken.token);

    return (...args: any[]) => broadcastMessage(channel, ...args.map(toJS));
  }) as Injectable<InjectionToken<ChannelCallable<Token>, void>, ChannelCallable<Token>, void>;
}
