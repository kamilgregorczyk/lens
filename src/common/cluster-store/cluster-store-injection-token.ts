/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectionToken } from "@ogre-tools/injectable";
import type { ClusterStore } from "./cluster-store";

export const clusterStoreInjectionToken = getInjectionToken<ClusterStore>();
