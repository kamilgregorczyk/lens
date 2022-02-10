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

export type GetAppPath = (pathName: PathName) => string | null;

const getAppPath = ({ app }: Dependencies): GetAppPath => (
  (pathName) => {
    try {
      return app.getPath(pathName);
    } catch {
      return null;
    }
  }
);

const getAppPathInjectable = getInjectable({
  instantiate: (di) => getAppPath({
    app: di.inject(electronAppInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default getAppPathInjectable;
