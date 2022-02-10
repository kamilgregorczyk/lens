/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { clusterVisibilityHandler } from "../../../common/ipc/cluster";
import type { ClusterId } from "../../../common/cluster-types";
import { broadcastMainChannel, broadcastMessage, ipcMainHandle, ipcMainOn } from "../../../common/ipc";
import { ClusterManager } from "../../clusters/manager";
import type { MenuRegistration } from "../../menu/menu-registration";
import type { IComputedValue } from "mobx";
import { openFilePickingDialogChannel } from "../../../common/ipc/dialog";
import { showOpenDialog } from "../../ipc/dialog";

interface Dependencies {
  electronMenuItems: IComputedValue<MenuRegistration[]>,
}

export const initIpcMainHandlers = ({ electronMenuItems }: Dependencies) => () => {
  ipcMainOn(clusterVisibilityHandler, (event, clusterId?: ClusterId) => {
    ClusterManager.getInstance().visibleCluster = clusterId;
  });

  ipcMainHandle(openFilePickingDialogChannel, (event, opts) => showOpenDialog(opts));

  ipcMainHandle(broadcastMainChannel, (event, channel, ...args) => broadcastMessage(channel, ...args));
};
