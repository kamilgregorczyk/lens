/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import clusterFramesInjectable from "../clusters/frames.injectable";
import { WindowManager } from "./manager";

const windowManagerInjectable = getInjectable({
  instantiate: (di) => new WindowManager({
    clusterFrames: di.inject(clusterFramesInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default windowManagerInjectable;
