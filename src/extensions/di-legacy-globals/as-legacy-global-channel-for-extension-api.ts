/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { Channel, ChannelCallable } from "../../common/ipc/channel";
import { asLegacyGlobalFunctionForExtensionApi } from "./as-legacy-global-function-for-extension-api";

export function asLegacyGlobalChannelForExtensionApi<Token extends Channel<any[], any>>(channel: Token): ChannelCallable<Token> {
  return asLegacyGlobalFunctionForExtensionApi(channel.token) as ChannelCallable<Token>;
}
