/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { disconnectClusterInjectionToken } from "../../common/ipc/disconnect-cluster-injection-token";
import { implChannelWithInvoke } from "./invoke-impl";

const disconnectClusterInjectable = implChannelWithInvoke(disconnectClusterInjectionToken);

export default disconnectClusterInjectable;
