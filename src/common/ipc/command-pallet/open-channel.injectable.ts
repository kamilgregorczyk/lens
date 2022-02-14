/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ClusterId } from "../../cluster-types";

export type OpenCommandPalletChannel = (clusterId?: ClusterId) => string;

const openCommandPalletChannelInjectable = getInjectable({
  instantiate: (): OpenCommandPalletChannel => (clusterId?: ClusterId) => (
    ["command-pallet:open", clusterId]
      .filter(Boolean)
      .join(":")
  ),
  lifecycle: lifecycleEnum.singleton,
});

export default openCommandPalletChannelInjectable;
