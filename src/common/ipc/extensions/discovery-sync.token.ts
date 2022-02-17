/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getStreamInjectionToken } from "../channel";

export interface ExtensionsInitiallyLoaded {
  isLoaded: boolean;
}

export const requestExtensionDiscoverySyncStreamInjectionToken = getStreamInjectionToken<ExtensionsInitiallyLoaded>("extensions:discovery:sync");
