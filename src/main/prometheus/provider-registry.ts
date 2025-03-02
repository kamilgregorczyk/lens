/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { CoreV1Api } from "@kubernetes/client-node";
import { inspect } from "util";
import { Singleton } from "../../common/utils";

export type PrometheusService = {
  id: string;
  namespace: string;
  service: string;
  port: number;
};

export abstract class PrometheusProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly rateAccuracy: string;
  abstract readonly isConfigurable: boolean;

  abstract getQuery(opts: Record<string, string>, queryName: string): string;
  abstract getPrometheusService(client: CoreV1Api): Promise<PrometheusService | undefined>;

  protected bytesSent(ingress: string, namespace: string, statuses: string): string {
    return `sum(rate(nginx_ingress_controller_bytes_sent_sum{ingress="${ingress}",namespace="${namespace}",status=~"${statuses}"}[${this.rateAccuracy}])) by (ingress, namespace)`;
  }

  protected async getFirstNamespacedService(client: CoreV1Api, ...selectors: string[]): Promise<PrometheusService> {
    try {
      for (const selector of selectors) {
        const { body: { items: [service] }} = await client.listServiceForAllNamespaces(null, null, null, selector);

        if (service) {
          return {
            id: this.id,
            namespace: service.metadata.namespace,
            service: service.metadata.name,
            port: service.spec.ports[0].port,
          };
        }
      }
    } catch (error) {
      throw new Error(`Failed to list services for Prometheus${this.name} in all namespaces: ${error.response.body.message}`);
    }

    throw new Error(`No service found for Prometheus${this.name} from any namespace`);
  }

  protected async getNamespacedService(client: CoreV1Api, name: string, namespace: string): Promise<PrometheusService> {
    try {
      const resp = await client.readNamespacedService(name, namespace);
      const service = resp.body;

      return {
        id: this.id,
        namespace: service.metadata.namespace,
        service: service.metadata.name,
        port: service.spec.ports[0].port,
      };
    } catch(error) {
      throw new Error(`Failed to list services for Prometheus${this.name} in namespace=${inspect(namespace, false, undefined, false)}: ${error.response.body.message}`);
    }
  }
}

export class PrometheusProviderRegistry extends Singleton {
  public providers = new Map<string, PrometheusProvider>();

  getByKind(kind: string): PrometheusProvider {
    const provider = this.providers.get(kind);

    if (!provider) {
      throw new Error("Unknown Prometheus provider");
    }

    return provider;
  }

  registerProvider(provider: PrometheusProvider): this {
    if (this.providers.has(provider.id)) {
      throw new Error("Provider already registered under that kind");
    }

    this.providers.set(provider.id, provider);

    return this;
  }
}
