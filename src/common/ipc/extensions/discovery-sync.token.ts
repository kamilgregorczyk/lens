/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { ExtensionDiscoveryState } from "../../../extensions/discovery/discovery";
import { getStreamInjectionToken } from "../channel";

export const requestExtensionDiscoverySyncStreamInjectionToken = getStreamInjectionToken<ExtensionDiscoveryState>("extensions:discovery:sync");
