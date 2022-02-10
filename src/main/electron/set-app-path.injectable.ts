/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { App } from "electron";
import type { PathName } from "../../common/ipc/electron/app-path-names";
import electronAppInjectable from "./app.injectable";

interface Dependencies {
  app: App;
}

export type SetAppPath = (pathName: PathName, value: string) => void;

const setAppPath = ({ app }: Dependencies): SetAppPath => (
  (pathName, value) => {
    app.setPath(pathName, value);
  }
);

const setAppPathInjectable = getInjectable({
  instantiate: (di) => setAppPath({
    app: di.inject(electronAppInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default setAppPathInjectable;
