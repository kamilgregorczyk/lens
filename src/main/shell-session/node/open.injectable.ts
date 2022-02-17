/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { NodeShellSession, NodeShellSessionArgs, NodeShellSessionDependencies } from "./shell-session";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import appEventBusInjectable from "../../../common/app-event-bus/app-event-bus.injectable";
import statInjectable from "../../../common/fs/stat.injectable";
import resolvedShellInjectable from "../../../common/user-preferences/resolved-shell.injectable";
import appNameInjectable from "../../electron/app-name.injectable";
import electronAppVersionInjectable from "../../electron/app-version.injectable";
import ensureShellProcessInjectable from "../ensure-process.injectable";
import localShellSessionLoggerInjectable from "../local/logger.injectable";
import { kubeJsonApiForClusterInjectionToken } from "../../../common/k8s-api/kube-json-api-for-cluster.token";

export type OpenNodeShellSession = (args: NodeShellSessionArgs) => void;

const openNodeShellSession = (deps: NodeShellSessionDependencies): OpenNodeShellSession => (
  (args) => {
    new NodeShellSession(deps, args)
      .open()
      .catch(error => deps.logger.error("Failed to open a node shell", error));
  }
);

const openNodeShellSessionInjectable = getInjectable({
  instantiate: (di) => openNodeShellSession({
    appEventBus: di.inject(appEventBusInjectable),
    appName: di.inject(appNameInjectable),
    appVersion: di.inject(electronAppVersionInjectable),
    ensureShellProcess: di.inject(ensureShellProcessInjectable),
    logger: di.inject(localShellSessionLoggerInjectable),
    stat: di.inject(statInjectable),
    resolvedShell: di.inject(resolvedShellInjectable),
    kubeJsonApiForCluster: di.inject(kubeJsonApiForClusterInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default openNodeShellSessionInjectable;

