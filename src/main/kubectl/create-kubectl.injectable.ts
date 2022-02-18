/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { Kubectl, KubectlDependencies } from "./kubectl";
import directoryForKubectlBinariesInjectable from "./directory-for-kubectl-binaries/directory-for-kubectl-binaries.injectable";
import userPreferencesStoreInjectableInjectable from "../user-pereferences/store.injectable";

export type CreateKubectl = (clusterVersion: string) => Kubectl;

const createKubectl = (deps: KubectlDependencies): CreateKubectl => (
  (version) => new Kubectl(deps, version)
);

const createKubectlInjectable = getInjectable({
  instantiate: (di) => createKubectl({
    userStore: di.inject(userPreferencesStoreInjectableInjectable),
    directoryForKubectlBinaries: di.inject(directoryForKubectlBinariesInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default createKubectlInjectable;
