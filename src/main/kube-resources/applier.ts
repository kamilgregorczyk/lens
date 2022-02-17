/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { Cluster } from "../../common/clusters/cluster";
import type { KubernetesObject } from "@kubernetes/client-node";
import * as yaml from "js-yaml";
import path from "path";
import type { AppEventBus } from "../../common/app-event-bus/event-bus";
import { cloneJsonObject } from "../../common/utils";
import type { Patch } from "rfc6902";
import { promiseExecFile } from "../../common/utils/promise-exec";
import type { LensLogger } from "../../common/logger";
import type { WriteFile } from "../../common/fs/write-file.injectable";
import type { Remove } from "../../common/fs/remove.injectable";
import type { Unlink } from "../../common/fs/unlink.injectable";
import * as uuid from "uuid";

export interface ResourceApplierDependencies {
  readonly appEventBus: AppEventBus;
  readonly logger: LensLogger;
  writeFile: WriteFile;
  remove: Remove;
  unlink: Unlink;
  readonly tmpDir: string;
}

export class ResourceApplier {
  constructor(protected readonly dependencies: ResourceApplierDependencies, protected cluster: Cluster) {}

  /**
   * Patch a kube resource's manifest, throwing any error that occurs.
   * @param name The name of the kube resource
   * @param kind The kind of the kube resource
   * @param patch The list of JSON operations
   * @param ns The optional namespace of the kube resource
   */
  async patch(name: string, kind: string, patch: Patch, ns?: string): Promise<string> {
    this.dependencies.appEventBus.emit({ name: "resource", action: "patch" });

    const kubectl = await this.cluster.ensureKubectl();
    const kubectlPath = await kubectl.getPath();
    const proxyKubeconfigPath = await this.cluster.getProxyKubeconfigPath();
    const args = [
      "--kubeconfig", proxyKubeconfigPath,
      "patch",
      kind,
      name,
    ];

    if (ns) {
      args.push("--namespace", ns);
    }

    args.push(
      "--type", "json",
      "--patch", JSON.stringify(patch),
      "-o", "json",
    );

    try {
      const { stdout } = await promiseExecFile(kubectlPath, args);

      return stdout;
    } catch (error) {
      throw error.stderr ?? error;
    }
  }

  async apply(resource: KubernetesObject | any): Promise<string> {
    resource = this.sanitizeObject(resource);
    this.dependencies.appEventBus.emit({ name: "resource", action: "apply" });

    return this.kubectlApply(yaml.dump(resource));
  }

  protected async kubectlApply(content: string): Promise<string> {
    const kubectl = await this.cluster.ensureKubectl();
    const kubectlPath = await kubectl.getPath();
    const proxyKubeconfigPath = await this.cluster.getProxyKubeconfigPath();
    const fileName = path.resolve(this.dependencies.tmpDir, uuid.v4(), "resource.yaml");
    const args = [
      "apply",
      "--kubeconfig", proxyKubeconfigPath,
      "-o", "json",
      "-f", fileName,
    ];

    this.dependencies.logger.debug(`shooting manifests with ${kubectlPath}`, { args });

    const execEnv = { ...process.env };
    const httpsProxy = this.cluster.preferences?.httpsProxy;

    if (httpsProxy) {
      execEnv.HTTPS_PROXY = httpsProxy;
    }

    try {
      await this.dependencies.writeFile(fileName, content);
      const { stdout } = await promiseExecFile(kubectlPath, args);

      return stdout;
    } catch (error) {
      throw error?.stderr ?? error;
    } finally {
      await this.dependencies.unlink(fileName);
    }
  }

  public async kubectlApplyAll(resources: string[], extraArgs = ["-o", "json"]): Promise<string> {
    return this.kubectlCmdAll("apply", resources, extraArgs);
  }

  public async kubectlDeleteAll(resources: string[], extraArgs?: string[]): Promise<string> {
    return this.kubectlCmdAll("delete", resources, extraArgs);
  }

  protected async kubectlCmdAll(subCmd: string, resources: string[], extraArgs: string[] = []): Promise<string> {
    const kubectl = await this.cluster.ensureKubectl();
    const kubectlPath = await kubectl.getPath();
    const proxyKubeconfigPath = await this.cluster.getProxyKubeconfigPath();
    const tmpDir = path.resolve(this.dependencies.tmpDir, uuid.v4());

    const args = [
      subCmd,
      "--kubeconfig", proxyKubeconfigPath,
      ...extraArgs,
      "-f", tmpDir,
    ];

    args.push("-f", `"${tmpDir}"`);

    await Promise.all(resources.map((resource, index) => this.dependencies.writeFile(
      path.join(tmpDir, `${index}.yaml`),
      resource,
    )));

    this.dependencies.logger.info(`[RESOURCE-APPLIER] running kubectl`, { args });

    try {
      const { stdout } = await promiseExecFile(kubectlPath, args);

      return stdout;
    } catch (error) {
      if (error?.stderr) {
        const splitError = error.stderr.toString().split(`.yaml": `);

        if (splitError) {
          throw new Error(splitError);
        }
      }

      throw error;
    }
  }

  protected sanitizeObject(resource: KubernetesObject | any) {
    resource = cloneJsonObject(resource);
    delete resource.status;
    delete resource.metadata?.resourceVersion;
    const annotations = resource.metadata?.annotations;

    if (annotations) {
      delete annotations["kubectl.kubernetes.io/last-applied-configuration"];
    }

    return resource;
  }
}
