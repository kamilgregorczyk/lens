/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import glob from "glob";
import { memoize, kebabCase } from "lodash/fp";
import { createContainer } from "@ogre-tools/injectable";

import { setLegacyGlobalDiForExtensionApi } from "../extensions/di-legacy-globals/legacy-global-di-for-extension-api";
import appNameInjectable from "./electron/app-name.injectable";
import writeJsonFileInjectable from "../common/fs/write-json-file.injectable";
import readJsonFileInjectable from "../common/fs/read-json-file.injectable";
import type { LensLogger } from "../common/logger";
import baseLoggerInjectable from "./logger/base-logger.injectable";
import getAppPathInjectable from "./electron/get-app-path.injectable";
import setAppPathInjectable from "./electron/set-app-path.injectable";

export const getDiForUnitTesting = (
  { doGeneralOverrides } = { doGeneralOverrides: false },
) => {
  const di = createContainer();

  setLegacyGlobalDiForExtensionApi(di);

  for (const filePath of getInjectableFilePaths()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const injectableInstance = require(filePath).default;

    di.register({
      id: filePath,
      ...injectableInstance,
      aliases: [injectableInstance, ...(injectableInstance.aliases || [])],
    });
  }

  di.preventSideEffects();

  if (doGeneralOverrides) {
    di.override(baseLoggerInjectable, () => console as LensLogger);
    di.override(
      getAppPathInjectable,
      () => (name: string) => `some-electron-app-path-for-${kebabCase(name)}`,
    );

    di.override(setAppPathInjectable, () => () => undefined);
    di.override(appNameInjectable, () => "some-electron-app-name");

    di.override(writeJsonFileInjectable, () => () => {
      throw new Error("Tried to write JSON file to file system without specifying explicit override.");
    });

    di.override(readJsonFileInjectable, () => () => {
      throw new Error("Tried to read JSON file from file system without specifying explicit override.");
    });
  }

  return di;
};

const getInjectableFilePaths = memoize(() => [
  ...glob.sync("./**/*.injectable.{ts,tsx}", { cwd: __dirname }),
  ...glob.sync("../extensions/**/*.injectable.{ts,tsx}", { cwd: __dirname }),
  ...glob.sync("../common/**/*.injectable.{ts,tsx}", { cwd: __dirname }),
]);
