/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { emitWindowLoadedInjectionToken } from "../../../common/ipc/window/loaded.token";
import { implWithSend } from "../impl-with-send";

const emitWindowLoadedInjectable = implWithSend(emitWindowLoadedInjectionToken);

export default emitWindowLoadedInjectable;
