/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { activateClusterInjectionToken } from "../../common/ipc/cluster-activate.token";
import { implChannelWithInvoke } from "./invoke-impl";

const activateClusterInjectable = implChannelWithInvoke(activateClusterInjectionToken);

export default activateClusterInjectable;
