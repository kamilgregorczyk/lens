/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { isClusterPageContext } from "../../utils/cluster-id-url-parsing";
import { BaseKubeApiOptions, KubeApi } from "../kube-api";
import { KubeObject } from "../kube-object";

export type ClusterRoleBindingSubjectKind = "Group" | "ServiceAccount" | "User";

export interface ClusterRoleBindingSubject {
  kind: ClusterRoleBindingSubjectKind;
  name: string;
  apiGroup?: string;
  namespace?: string;
}

export interface ClusterRoleBinding {
  subjects?: ClusterRoleBindingSubject[];
  roleRef: {
    kind: string;
    name: string;
    apiGroup?: string;
  };
}

export class ClusterRoleBinding extends KubeObject {
  static kind = "ClusterRoleBinding";
  static namespaced = false;
  static apiBase = "/apis/rbac.authorization.k8s.io/v1/clusterrolebindings";

  getSubjects() {
    return this.subjects || [];
  }

  getSubjectNames(): string {
    return this.getSubjects().map(subject => subject.name).join(", ");
  }
}

/**
 * The api type for {@link ClusterRoleBinding}'s
 */
export class ClusterRoleBindingApi extends KubeApi<ClusterRoleBinding> {
  constructor(params?: BaseKubeApiOptions) {
    super({
      ...(params ?? {}),
      objectConstructor: ClusterRoleBinding,
    });
  }
}

/**
 * Only available within kubernetes cluster pages
 */
export const clusterRoleBindingApi = isClusterPageContext()
  ? new ClusterRoleBindingApi()
  : undefined;
