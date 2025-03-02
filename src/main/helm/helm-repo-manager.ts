/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import yaml from "js-yaml";
import { BaseEncodingOptions, readFile } from "fs-extra";
import { promiseExecFile } from "../../common/utils/promise-exec";
import { helmCli } from "./helm-cli";
import { Singleton } from "../../common/utils/singleton";
import { customRequestPromise } from "../../common/request";
import orderBy from "lodash/orderBy";
import logger from "../logger";
import type { ExecFileOptions } from "child_process";

export type HelmEnv = Record<string, string> & {
  HELM_REPOSITORY_CACHE?: string;
  HELM_REPOSITORY_CONFIG?: string;
};

export interface HelmRepoConfig {
  repositories: HelmRepo[];
}

export interface HelmRepo {
  name: string;
  url: string;
  cacheFilePath?: string;
  caFile?: string;
  certFile?: string;
  insecureSkipTlsVerify?: boolean;
  keyFile?: string;
  username?: string;
  password?: string;
}

async function execHelm(args: string[], options?: BaseEncodingOptions & ExecFileOptions): Promise<string> {
  const helmCliPath = await helmCli.binaryPath();

  try {
    const { stdout } = await promiseExecFile(helmCliPath, args, options);

    return stdout;
  } catch (error) {
    throw error?.stderr || error;
  }
}

export class HelmRepoManager extends Singleton {
  protected repos: HelmRepo[];
  protected helmEnv: HelmEnv;
  protected didUpdateOnce: boolean;

  public async loadAvailableRepos(): Promise<HelmRepo[]> {
    const res = await customRequestPromise({
      uri: "https://github.com/lensapp/artifact-hub-repositories/releases/download/latest/repositories.json",
      json: true,
      resolveWithFullResponse: true,
      timeout: 10000,
    });

    return orderBy(res.body as HelmRepo[], repo => repo.name);
  }

  private async ensureInitialized() {
    helmCli.setLogger(logger);
    await helmCli.ensureBinary();

    this.helmEnv ??= await this.parseHelmEnv();

    const repos = await this.list();

    if (repos.length === 0) {
      await this.addRepo({
        name: "bitnami",
        url: "https://charts.bitnami.com/bitnami",
      });
    }

    if (!this.didUpdateOnce) {
      await this.update();
      this.didUpdateOnce = true;
    }
  }

  protected async parseHelmEnv() {
    const output = await execHelm(["env"]);
    const lines = output.split(/\r?\n/); // split by new line feed
    const env: HelmEnv = {};

    lines.forEach((line: string) => {
      const [key, value] = line.split("=");

      if (key && value) {
        env[key] = value.replace(/"/g, ""); // strip quotas
      }
    });

    return env;
  }

  public async repo(name: string): Promise<HelmRepo> {
    const repos = await this.repositories();

    return repos.find(repo => repo.name === name);
  }

  private async list(): Promise<HelmRepo[]> {
    try {
      const rawConfig = await readFile(this.helmEnv.HELM_REPOSITORY_CONFIG, "utf8");
      const parsedConfig = yaml.load(rawConfig) as HelmRepoConfig;

      if (typeof parsedConfig === "object" && parsedConfig) {
        return parsedConfig.repositories;
      }
    } catch {
      // ignore error
    }

    return [];
  }

  public async repositories(): Promise<HelmRepo[]> {
    try {
      await this.ensureInitialized();

      const repos = await this.list();

      return repos.map(repo => ({
        ...repo,
        cacheFilePath: `${this.helmEnv.HELM_REPOSITORY_CACHE}/${repo.name}-index.yaml`,
      }));
    } catch (error) {
      logger.error(`[HELM]: repositories listing error`, error);

      return [];
    }
  }

  public async update() {
    return execHelm([
      "repo",
      "update",
    ]);
  }

  public async addRepo({ name, url, insecureSkipTlsVerify, username, password, caFile, keyFile, certFile }: HelmRepo) {
    logger.info(`[HELM]: adding repo ${name} from ${url}`);
    const args = [
      "repo",
      "add",
      name,
      url,
    ];

    if (insecureSkipTlsVerify) {
      args.push("--insecure-skip-tls-verify");
    }

    if (username) {
      args.push("--username", username);
    }

    if (password) {
      args.push("--password", password);
    }

    if (caFile) {
      args.push("--ca-file", caFile);
    }

    if (keyFile) {
      args.push("--key-file", keyFile);
    }

    if (certFile) {
      args.push("--cert-file", certFile);
    }

    return execHelm(args);
  }

  public async removeRepo({ name, url }: HelmRepo): Promise<string> {
    logger.info(`[HELM]: removing repo ${name} (${url})`);

    return execHelm([
      "repo",
      "remove",
      name,
    ]);
  }
}
