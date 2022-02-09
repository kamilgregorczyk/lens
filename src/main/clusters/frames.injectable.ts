/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { observable } from "mobx";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";

export interface ClusterFrameInfo {
  frameId: number;
  processId: number
}

const clusterFramesInjectable = getInjectable({
  instantiate: () => observable.map<string, ClusterFrameInfo>(),
  lifecycle: lifecycleEnum.singleton,
});

export default clusterFramesInjectable;
