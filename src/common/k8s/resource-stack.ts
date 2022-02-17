/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import path from "path";
import hb from "handlebars";
import type { KubernetesCluster } from "../catalog/entity/declarations";
import yaml from "js-yaml";
import { productName } from "../vars";
import { asLegacyGlobalFunctionForExtensionApi } from "../../extensions/di-legacy-globals/as-legacy-global-function-for-extension-api";
import { kubectlApplyAllInjectionToken } from "../ipc/kubectl/apply-all.token";
import { kubectlDeleteAllInjectionToken } from "../ipc/kubectl/delete-all.token";
import { asLegacyGlobalObjectForExtensionApi } from "../../extensions/di-legacy-globals/as-legacy-global-object-for-extension-api";
import resourceStackLoggerInjectable from "./resource-stack-logger.injectable";
import readDirInjectable from "../fs/read-dir.injectable";
import readFileInjectable from "../fs/read-file.injectable";

const kubectlApplyAll = asLegacyGlobalFunctionForExtensionApi(kubectlApplyAllInjectionToken.token);
const kubectlDeleteAll = asLegacyGlobalFunctionForExtensionApi(kubectlDeleteAllInjectionToken.token);
const logger = asLegacyGlobalObjectForExtensionApi(resourceStackLoggerInjectable);
const readDir = asLegacyGlobalFunctionForExtensionApi(readDirInjectable);
const readFile = asLegacyGlobalFunctionForExtensionApi(readFileInjectable);

export class ResourceStack {
  constructor(protected cluster: KubernetesCluster, protected name: string) {}

  /**
   *
   * @param folderPath folder path that is searched for files defining kubernetes resources.
   * @param templateContext sets the template parameters that are to be applied to any templated kubernetes resources that are to be applied.
   */
  async kubectlApplyFolder(folderPath: string, templateContext?: any, extraArgs?: string[]): Promise<string> {
    const resources = await this.renderTemplates(folderPath, templateContext);

    return this.applyResources(resources, extraArgs);
  }

  /**
   *
   * @param folderPath folder path that is searched for files defining kubernetes resources.
   * @param templateContext sets the template parameters that are to be applied to any templated kubernetes resources that are to be applied.
   */
  async kubectlDeleteFolder(folderPath: string, templateContext?: any, extraArgs?: string[]): Promise<string> {
    const resources = await this.renderTemplates(folderPath, templateContext);

    return this.deleteResources(resources, extraArgs);
  }

  protected async applyResources(resources: string[], extraArgs: string[] = []): Promise<string> {
    this.appendKubectlArgs(extraArgs);

    const response = await kubectlApplyAll(this.cluster.getId(), resources, extraArgs);

    if (response.stderr) {
      throw new Error(response.stderr);
    }

    return response.stdout;
  }

  protected async deleteResources(resources: string[], extraArgs?: string[]): Promise<string> {
    this.appendKubectlArgs(extraArgs);

    const response = await kubectlDeleteAll(this.cluster.getId(), resources, extraArgs);

    if (response.stderr) {
      throw new Error(response.stderr);
    }

    return response.stdout;
  }

  protected appendKubectlArgs(kubectlArgs: string[]) {
    if (!kubectlArgs.includes("-l") && !kubectlArgs.includes("--label")) {
      kubectlArgs.push("-l", `app.kubernetes.io/name=${this.name}`);
    }
  }

  protected async renderTemplates(folderPath: string, templateContext: any): Promise<string[]> {
    const resources: string[] = [];

    logger.info(`rendering templates from ${folderPath}`);
    const entries = await readDir(folderPath, { withFileTypes: true });

    for(const entry of entries) {
      if (!entry.isFile()) {
        continue;
      }

      const file = path.join(folderPath, entry.name);
      const raw = await readFile(file, { encoding: "utf-8" });
      const data = (
        entry.name.endsWith(".hb")
          ? hb.compile(raw)(templateContext)
          : raw
      ).trim();

      if (!data) {
        continue;
      }

      for (const entry of yaml.loadAll(data)) {
        if (typeof entry !== "object" || !entry) {
          continue;
        }

        const resource = entry as Record<string, any>;

        if (typeof resource.metadata === "object") {
          resource.metadata.labels ??= {};
          resource.metadata.labels["app.kubernetes.io/name"] = this.name;
          resource.metadata.labels["app.kubernetes.io/managed-by"] = productName;
          resource.metadata.labels["app.kubernetes.io/created-by"] = "resource-stack";
        }

        resources.push(yaml.dump(resource));
      }
    }

    return resources;
  }
}
