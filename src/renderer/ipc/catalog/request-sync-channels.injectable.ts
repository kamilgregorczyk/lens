/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { requestCatalogSyncStreamChannelsInjectionToken } from "../../../common/ipc/catalog/sync.token";
import { implWithInvoke } from "../impl-channel";

const requestCatalogSyncStreamChannelsInjectable = implWithInvoke(requestCatalogSyncStreamChannelsInjectionToken);

export default requestCatalogSyncStreamChannelsInjectable;
