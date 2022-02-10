/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { DependencyInjectionContainer, getInjectable, getInjectionToken, InjectionToken, lifecycleEnum } from "@ogre-tools/injectable";

export type ChannelCallable<T> = T extends Channel<infer Args, infer R> ? (...args: Args) => R : never;

export interface Listenable {
  on: (channel: string, listener: (...args: any[]) => void) => void;
}

export class Channel<Args extends any[], R> {
  readonly token: InjectionToken<(...args: Args) => R, void>;

  constructor(private readonly channel: string) {
    this.token = getInjectionToken<(...args: Args) => R>();
  }

  getInjectable(init: (di: DependencyInjectionContainer, channel: string) => (...args: Args) => R) {
    let handler: (...args: Args) => R;

    return getInjectable({
      setup: (di) => {
        handler = init(di, this.channel);
      },
      instantiate: () => handler,
      injectionToken: this.token,
      lifecycle: lifecycleEnum.singleton,
    });
  }

  setupListener(emitter: Listenable, listener: (...args: Args) => void) {
    emitter.on(this.channel, listener);
  }
}

const channelNames = new Set<string>();

export function getChannelInjectionToken<Fn extends (...args: any[]) => Promise<any>>(channel: string): Channel<Parameters<Fn>, ReturnType<Fn>> {
  if (channelNames.has(channel)) {
    throw new Error(`Cannot use IPC channel name "${channel}" multiple times`);
  } else {
    channelNames.add(channel);
  }

  return new Channel(channel);
}

export function getChannelEmitterInjectionToken<Fn extends (...args: any[]) => void>(channel: string): Channel<Parameters<Fn>, ReturnType<Fn>> {
  if (channelNames.has(channel)) {
    throw new Error(`Cannot use IPC channel name "${channel}" multiple times`);
  } else {
    channelNames.add(channel);
  }

  return new Channel(channel);
}
