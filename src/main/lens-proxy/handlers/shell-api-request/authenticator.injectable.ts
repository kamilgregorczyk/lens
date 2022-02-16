/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { ShellRequestAuthenticator } from "./authenticator";

const shellRequestAuthenticatorInjectable = getInjectable({
  instantiate: () => new ShellRequestAuthenticator(),

  lifecycle: lifecycleEnum.singleton,
});

export default shellRequestAuthenticatorInjectable;
