/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { LensExtensionManifest } from "../../../extensions/lens-extension";
import type { SemVer } from "semver";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import appVersionInjectable from "../../../common/vars/app-version.injectable";
import isProductionInjectable from "../../../common/vars/is-production.injectable";

export type IsCompatibleBundledExtension = (manifest: LensExtensionManifest) => boolean;

interface Dependencies {
  appVersion: SemVer;
  isProduction: boolean;
}

const isCompatibleBundledExtension = ({
  appVersion,
  isProduction,
}: Dependencies): IsCompatibleBundledExtension => (
  isProduction
    ? (manifest) => manifest.version.compare(appVersion) === 0
    : () => true
);

const isCompatibleBundledExtensionInjectable = getInjectable({
  instantiate: (di) => isCompatibleBundledExtension({
    appVersion: di.inject(appVersionInjectable),
    isProduction: di.inject(isProductionInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default isCompatibleBundledExtensionInjectable;
