/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { installOnDrop } from "./install-on-drop";
import attemptInstallsInjectable from "../attempt-installs/attempt-installs.injectable";
import extensionsPageLoggerInjectable from "../logger.injectable";

const installOnDropInjectable = getInjectable({
  instantiate: (di) => installOnDrop({
    attemptInstalls: di.inject(attemptInstallsInjectable),
    logger: di.inject(extensionsPageLoggerInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default installOnDropInjectable;
