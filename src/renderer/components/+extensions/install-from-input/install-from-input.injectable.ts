/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import attemptInstallInjectable from "../attempt-install/attempt-install.injectable";
import { installFromInput } from "./install-from-input";
import attemptInstallByInfoInjectable from "../attempt-install-by-info/attempt-install-by-info.injectable";
import extensionInstallationStateManagerInjectable from "../../../../extensions/installation-state/manager.injectable";
import errorNotificationInjectable from "../../notifications/error.injectable";
import extensionsPageLoggerInjectable from "../logger.injectable";

const installFromInputInjectable = getInjectable({
  instantiate: (di) => installFromInput({
    attemptInstall: di.inject(attemptInstallInjectable),
    attemptInstallByInfo: di.inject(attemptInstallByInfoInjectable),
    installationStateManager: di.inject(extensionInstallationStateManagerInjectable),
    errorNotification: di.inject(errorNotificationInjectable),
    logger: di.inject(extensionsPageLoggerInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default installFromInputInjectable;
