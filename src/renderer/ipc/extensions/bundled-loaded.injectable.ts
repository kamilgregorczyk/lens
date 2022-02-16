/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { bundledExtensionsLoadedInjectionToken } from "../../../common/ipc/extensions/bundled-loaded.token";
import { implWithSend } from "../impl-channel";

const bundledExtensionsLoadedInjectable = implWithSend(bundledExtensionsLoadedInjectionToken);

export default bundledExtensionsLoadedInjectable;
