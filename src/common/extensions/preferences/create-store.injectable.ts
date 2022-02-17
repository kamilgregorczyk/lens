/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { BaseStoreParams } from "../../base-store";
import directoryForUserDataInjectable from "../../paths/user-data.injectable";
import extensionsPreferencesStoreLoggerInjectable from "./logger.injectable";
import { ExtensionsPreferencesStore, ExtensionsPreferencesDependencies, ExtensionsPreferencesStoreModel } from "./store";

const createExtensionsPreferencesStoreInjectable = getInjectable({
  instantiate: (di) => {
    const deps: ExtensionsPreferencesDependencies = {
      logger: di.inject(extensionsPreferencesStoreLoggerInjectable),
      userDataPath: di.inject(directoryForUserDataInjectable),
    };

    return (params: BaseStoreParams<ExtensionsPreferencesStoreModel>) => new ExtensionsPreferencesStore(deps, params);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default createExtensionsPreferencesStoreInjectable;
