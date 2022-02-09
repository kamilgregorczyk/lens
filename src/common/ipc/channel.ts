/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { DependencyInjectionContainer, getInjectable, getInjectionToken, InjectionToken, lifecycleEnum } from "@ogre-tools/injectable";

export type ChannelCallable<T> = T extends Channel<infer Args, infer R> ? (...args: Args) => Promise<R> : never;

export class Channel<Args extends any[], R> {
  readonly token: InjectionToken<(...args: Args) => Promise<R>, void>;

  constructor(private readonly channel: string) {
    this.token = getInjectionToken<(...args: Args) => Promise<R>>();
  }

  getInjectable(init: (di: DependencyInjectionContainer, channel: string) => (...args: Args) => Promise<R>) {
    let handler: (...args: Args) => Promise<R>;

    return getInjectable({
      setup: (di) => {
        handler = init(di, this.channel);
      },
      instantiate: () => handler,
      injectionToken: this.token,
      lifecycle: lifecycleEnum.singleton,
    });
  }
}

type PromiseValue<T> = T extends Promise<infer Value> ? Value : never;

export function getChannelInjectionToken<Fn extends (...args: any[]) => Promise<any>>(channel: string): Channel<Parameters<Fn>, PromiseValue<ReturnType<Fn>>> {
  return new Channel(channel);
}
