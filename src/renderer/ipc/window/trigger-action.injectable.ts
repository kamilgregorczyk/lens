/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { triggerWindowActionInjectionToken } from "../../../common/ipc/window/trigger-action.token";
import { implWithSend } from "../impl-with-send";

const triggerWindowActionInjectable = implWithSend(triggerWindowActionInjectionToken);

export default triggerWindowActionInjectable;
