/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ClusterId } from "../../cluster-types";
import { BroadcastMessage, broadcastMessageInjectionToken } from "../broadcast/message.token";
import type { OpenCommandPalletChannel } from "./open-channel.injectable";
import openCommandPalletChannelInjectable from "./open-channel.injectable";

export type OpenCommandPallet = (clusterId?: ClusterId) => void;

interface Dependencies {
  broadcastMessage: BroadcastMessage;
  openCommandPalletChannel: OpenCommandPalletChannel;
}

const openCommandPallet = ({ broadcastMessage, openCommandPalletChannel }: Dependencies): OpenCommandPallet => (
  (clusterId) => {
    broadcastMessage(openCommandPalletChannel(clusterId));
  }
);

const openCommandPalletInjectable = getInjectable({
  instantiate: (di) => openCommandPallet({
    broadcastMessage: di.inject(broadcastMessageInjectionToken.token),
    openCommandPalletChannel: di.inject(openCommandPalletChannelInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default openCommandPalletInjectable;
