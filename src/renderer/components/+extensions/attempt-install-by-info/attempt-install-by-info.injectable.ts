/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { attemptInstallByInfo } from "./attempt-install-by-info";
import attemptInstallInjectable from "../attempt-install/attempt-install.injectable";
import getBaseRegistryUrlInjectable from "../get-base-registry-url/get-base-registry-url.injectable";
import extensionInstallationStateManagerInjectable
  from "../../../../extensions/installation-state/manager.injectable";

const attemptInstallByInfoInjectable = getInjectable({
  instantiate: (di) =>
    attemptInstallByInfo({
      attemptInstall: di.inject(attemptInstallInjectable),
      getBaseRegistryUrl: di.inject(getBaseRegistryUrlInjectable),
      extensionInstallationStateStore: di.inject(extensionInstallationStateManagerInjectable),
    }),

  lifecycle: lifecycleEnum.singleton,
});

export default attemptInstallByInfoInjectable;
