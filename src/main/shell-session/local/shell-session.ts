/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import path from "path";
import { helmCli } from "../../helm/helm-cli";
import { ShellSession, ShellSessionArgs, ShellSessionDependencies } from "../shell-session";
import type { IComputedValue } from "mobx";
import type { TerminalShellEnvModify } from "../shell-env-modifier/modifier.injectable";

export interface LocalShellSessionArgs extends ShellSessionArgs {
}

export interface LocalShellSessionDependencies extends ShellSessionDependencies {
  readonly kubectlBinariesPath: IComputedValue<string>;
  readonly downloadKubectlBinaries: IComputedValue<boolean>;
  shellEnvModify: TerminalShellEnvModify;
}

export class LocalShellSession extends ShellSession {
  readonly ShellType = "shell";

  constructor(protected readonly dependencies: LocalShellSessionDependencies, args: LocalShellSessionArgs) {
    super(dependencies, args);
  }

  protected getPathEntries(): string[] {
    return [helmCli.getBinaryDir()];
  }

  protected get cwd(): string | undefined {
    return this.cluster.preferences?.terminalCWD;
  }

  public async open() {
    let env = await this.getCachedShellEnv();

    // extensions can modify the env
    env = this.dependencies.shellEnvModify(this.cluster.id, env);

    const shell = env.PTYSHELL;
    const args = await this.getShellArgs(shell);

    await this.openShellProcess(env.PTYSHELL, args, env);
  }

  protected async getShellArgs(shell: string): Promise<string[]> {
    const helmpath = helmCli.getBinaryDir();
    const pathFromPreferences = this.dependencies.kubectlBinariesPath.get() || this.kubectl.getBundledPath();
    const kubectlPathDir = this.dependencies.downloadKubectlBinaries.get() ? await this.kubectlBinDirP : path.dirname(pathFromPreferences);

    switch(path.basename(shell)) {
      case "powershell.exe":
        return ["-NoExit", "-command", `& {$Env:PATH="${helmpath};${kubectlPathDir};$Env:PATH"}`];
      case "bash":
        return ["--init-file", path.join(await this.kubectlBinDirP, ".bash_set_path")];
      case "fish":
        return ["--login", "--init-command", `export PATH="${helmpath}:${kubectlPathDir}:$PATH"; export KUBECONFIG="${await this.kubeconfigPathP}"`];
      case "zsh":
        return ["--login"];
      default:
        return [];
    }
  }
}
