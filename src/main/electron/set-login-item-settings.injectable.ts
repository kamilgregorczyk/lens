/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { App, Settings } from "electron";
import electronAppInjectable from "./app.injectable";

export type SetLoginItemSettings = (settings: Settings) => void;

interface Dependencies {
  app: App;
}

const setLoginItemSettings = ({ app }: Dependencies): SetLoginItemSettings => (
  (settings) => app.setLoginItemSettings(settings)
);

const setLoginItemSettingsInjectable = getInjectable({
  instantiate: (di) => setLoginItemSettings({
    app: di.inject(electronAppInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default setLoginItemSettingsInjectable;
