/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { PortForward, PortForwardArgs, PortForwardDependencies } from "./port-forward";
import bundledKubectlInjectable from "../../kubectl/bundled-kubectl.injectable";

export type CreatePortForward = (pathToKubeConfig: string, args: PortForwardArgs) => PortForward;

const createPortForward = (deps: PortForwardDependencies): CreatePortForward => (
  (kubeconfigPath, args) => new PortForward(deps, kubeconfigPath, args)
);

const createPortForwardInjectable = getInjectable({
  instantiate: (di) => createPortForward({
    getKubectlBinPath: di.inject(bundledKubectlInjectable).getPath,
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default createPortForwardInjectable;
