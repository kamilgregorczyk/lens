/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { NavigateAction } from "../components/command-palette/registered-commands/commands";
import navigateInAppInjectable from "../ipc/window/navigate-in-app.injectable";
import navigateInjectable, { Navigate } from "../navigation/navigate.injectable";

interface Dependencies {
  navigateRootFrame: Navigate;
  navigate: Navigate;
}

const navigateAction = ({ navigate, navigateRootFrame }: Dependencies): NavigateAction => (
  (url, opts) => {
    const forceRootFrame = (opts ?? {}).forceRootFrame ?? false;

    if (forceRootFrame) {
      navigateRootFrame(url);
    } else {
      navigate(url);
    }
  }
);

const navigateActionInjectable = getInjectable({
  instantiate: (di) => navigateAction({
    navigate: di.inject(navigateInjectable),
    navigateRootFrame: di.inject(navigateInAppInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default navigateActionInjectable;
