/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { reaction } from "mobx";
import type { VisibleClusterChanged } from "../../common/ipc/window/visible-cluster-changed.token";
import emitVisibleClusterChangedInjectable from "../ipc/window/visible-cluster-changed.injectable";
import { getMatchedClusterId } from "../navigation";

interface Dependencies {
  emitVisibleClusterChanged: VisibleClusterChanged;
}

const initVisibleClusterChanged = ({ emitVisibleClusterChanged }: Dependencies) => (
  () => {
    reaction(
      () => getMatchedClusterId(),
      emitVisibleClusterChanged,
      {
        fireImmediately: true,
      },
    );
  }
);

const initVisibleClusterChangedInjectable = getInjectable({
  instantiate: (di) => initVisibleClusterChanged({
    emitVisibleClusterChanged: di.inject(emitVisibleClusterChangedInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default initVisibleClusterChangedInjectable;
