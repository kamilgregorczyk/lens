/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { ClusterId } from "../../../../common/cluster-types";
import type { ShellRequestAuthenticator } from "./authenticator";
import shellRequestAuthenticatorInjectable from "./authenticator.injectable";

export type AuthenticateRequest = (clusterId: ClusterId, tabId: string, token: string) => boolean;

interface Dependencies {
  authenticator: ShellRequestAuthenticator;
}

const authenticateRequest = ({ authenticator }: Dependencies): AuthenticateRequest => (
  (clusterId, tabId, token) => authenticator.authenticate(clusterId, tabId, token)
);

const authenticateRequestInjectable = getInjectable({
  instantiate: (di) => authenticateRequest({
    authenticator: di.inject(shellRequestAuthenticatorInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default authenticateRequestInjectable;
