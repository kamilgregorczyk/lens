/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { DependencyInjectionContainer } from "@ogre-tools/injectable";
import type { Channel } from "../../common/ipc/channel";
import ipcRendererInjectable from "./ipc-renderer.injectable";

export function setupListener<Args extends any[]>(di: DependencyInjectionContainer, channelToken: Channel<Args, void>, listener: (...args: Args) => void) {
  const ipcRenderer = di.inject(ipcRendererInjectable);

  channelToken.setupListener(ipcRenderer, listener);
}
