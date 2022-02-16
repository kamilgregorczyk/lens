/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { LocalShellSession, LocalShellSessionArgs, LocalShellSessionDependencies } from "./shell-session";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import appEventBusInjectable from "../../../common/app-event-bus/app-event-bus.injectable";
import appNameInjectable from "../../electron/app-name.injectable";
import appVersionInjectable from "../../electron/app-version.injectable";
import ensureShellProcessInjectable from "../ensure-process.injectable";
import localShellSessionLoggerInjectable from "./logger.injectable";
import terminalShellEnvModifyInjectable from "../shell-env-modifier/modifier.injectable";
import statInjectable from "../../../common/fs/stat.injectable";
import resolvedShellInjectable from "../../../common/user-preferences/resolved-shell.injectable";
import downloadKubectlBinariesInjectable from "../../../common/user-preferences/download-kubectl-binaries.injectable";
import kubectlBinariesPathInjectable from "../../../common/user-preferences/kubectl-download-path.injectable";

export type OpenLocalShellSession = (args: LocalShellSessionArgs) => void;

const openLocalShellSession = (deps: LocalShellSessionDependencies): OpenLocalShellSession => (
  (args) => new LocalShellSession(deps, args)
);

const openLocalShellSessionInjectable = getInjectable({
  instantiate: (di) => openLocalShellSession({
    appEventBus: di.inject(appEventBusInjectable),
    appName: di.inject(appNameInjectable),
    appVersion: di.inject(appVersionInjectable),
    ensureShellProcess: di.inject(ensureShellProcessInjectable),
    logger: di.inject(localShellSessionLoggerInjectable),
    shellEnvModify: di.inject(terminalShellEnvModifyInjectable),
    stat: di.inject(statInjectable),
    resolvedShell: di.inject(resolvedShellInjectable),
    downloadKubectlBinaries: di.inject(downloadKubectlBinariesInjectable),
    kubectlBinariesPath: di.inject(kubectlBinariesPathInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default openLocalShellSessionInjectable;

