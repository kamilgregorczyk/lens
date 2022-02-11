/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { observable } from "mobx";
import type { ClusterId } from "../../common/cluster-types";

const activeClusterIdInjectable = getInjectable({
  instantiate: () => observable.box<ClusterId | undefined>(),
  lifecycle: lifecycleEnum.singleton,
});

export default activeClusterIdInjectable;
