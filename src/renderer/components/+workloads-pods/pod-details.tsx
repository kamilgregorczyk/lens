/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./pod-details.scss";

import React from "react";
import kebabCase from "lodash/kebabCase";
import { disposeOnUnmount, observer } from "mobx-react";
import { Link } from "react-router-dom";
import { observable, reaction, makeObservable } from "mobx";
import { IPodMetrics, nodesApi, Pod, pvcApi, configMapApi, getMetricsForPods } from "../../../common/k8s-api/endpoints";
import { DrawerItem, DrawerTitle } from "../drawer";
import { Badge } from "../badge";
import { boundMethod, cssNames, toJS } from "../../utils";
import { PodDetailsContainer } from "./pod-details-container";
import { PodDetailsAffinities } from "./pod-details-affinities";
import { PodDetailsTolerations } from "./pod-details-tolerations";
import { Icon } from "../icon";
import { PodDetailsSecrets } from "./pod-details-secrets";
import { ResourceMetrics } from "../resource-metrics";
import type { KubeObjectDetailsProps } from "../kube-object-details";
import { getItemMetrics } from "../../../common/k8s-api/endpoints/metrics.api";
import { PodCharts, podMetricTabs } from "./pod-charts";
import { KubeObjectMeta } from "../kube-object-meta";
import { ClusterMetricsResourceType } from "../../../common/cluster-types";
import { getDetailsUrl } from "../kube-detail-params";
import logger from "../../../common/logger";
import type { ShouldDisplayMetric } from "../../clusters/should-display-metric.injectable";
import { withInjectables } from "@ogre-tools/injectable-react";
import shouldDisplayMetricInjectable from "../../clusters/should-display-metric.injectable";

interface Props extends KubeObjectDetailsProps<Pod> {
}

interface Dependencies {
  shouldDisplayMetric: ShouldDisplayMetric;
}

@observer
class NonInjectedPodDetails extends React.Component<Props & Dependencies> {
  @observable metrics: IPodMetrics;
  @observable containerMetrics: IPodMetrics;

  constructor(props: Props & Dependencies) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    disposeOnUnmount(this, [
      reaction(() => this.props.object, () => {
        this.metrics = null;
        this.containerMetrics = null;
      }),
    ]);
  }

  @boundMethod
  async loadMetrics() {
    const { object: pod } = this.props;

    this.metrics = await getMetricsForPods([pod], pod.getNs());
    this.containerMetrics = await getMetricsForPods([pod], pod.getNs(), "container, namespace");
  }

  render() {
    const { object: pod, shouldDisplayMetric } = this.props;

    if (!pod) {
      return null;
    }

    if (!(pod instanceof Pod)) {
      logger.error("[PodDetails]: passed object that is not an instanceof Pod", pod);

      return null;
    }

    const { status, spec } = pod;
    const { conditions, podIP } = status;
    const podIPs = pod.getIPs();
    const { nodeName } = spec;
    const nodeSelector = pod.getNodeSelectors();
    const volumes = pod.getVolumes();

    return (
      <div className="PodDetails">
        {shouldDisplayMetric(ClusterMetricsResourceType.Pod) && (
          <ResourceMetrics
            loader={this.loadMetrics}
            tabs={podMetricTabs} object={pod} params={{ metrics: this.metrics }}
          >
            <PodCharts/>
          </ResourceMetrics>
        )}
        <KubeObjectMeta object={pod}/>
        <DrawerItem name="Status">
          <span className={cssNames("status", kebabCase(pod.getStatusMessage()))}>{pod.getStatusMessage()}</span>
        </DrawerItem>
        <DrawerItem name="Node">
          {nodeName && (
            <Link to={getDetailsUrl(nodesApi.getUrl({ name: nodeName }))}>
              {nodeName}
            </Link>
          )}
        </DrawerItem>
        <DrawerItem name="Pod IP">
          {podIP}
        </DrawerItem>
        <DrawerItem name="Pod IPs" hidden={!podIPs.length} labelsOnly>
          {
            podIPs.map(label => (
              <Badge key={label} label={label}/>
            ))
          }
        </DrawerItem>
        <DrawerItem name="Priority Class">
          {pod.getPriorityClassName()}
        </DrawerItem>
        <DrawerItem name="QoS Class">
          {pod.getQosClass()}
        </DrawerItem>
        {conditions &&
        <DrawerItem name="Conditions" className="conditions" labelsOnly>
          {
            conditions.map(condition => {
              const { type, status, lastTransitionTime } = condition;

              return (
                <Badge
                  key={type}
                  label={type}
                  disabled={status === "False"}
                  tooltip={`Last transition time: ${lastTransitionTime}`}
                />
              );
            })
          }
        </DrawerItem>
        }
        {nodeSelector.length > 0 &&
        <DrawerItem name="Node Selector">
          {
            nodeSelector.map(label => (
              <Badge key={label} label={label}/>
            ))
          }
        </DrawerItem>
        }
        <PodDetailsTolerations workload={pod}/>
        <PodDetailsAffinities workload={pod}/>

        {pod.getSecrets().length > 0 && (
          <DrawerItem name="Secrets">
            <PodDetailsSecrets pod={pod}/>
          </DrawerItem>
        )}

        {pod.getInitContainers() && pod.getInitContainers().length > 0 &&
        <DrawerTitle title="Init Containers"/>
        }
        {
          pod.getInitContainers() && pod.getInitContainers().map(container => {
            return <PodDetailsContainer key={container.name} pod={pod} container={container}/>;
          })
        }
        <DrawerTitle title="Containers"/>
        {
          pod.getContainers().map(container => {
            const { name } = container;
            const metrics = getItemMetrics(toJS(this.containerMetrics), name);

            return (
              <PodDetailsContainer
                key={name}
                pod={pod}
                container={container}
                metrics={metrics || null}
              />
            );
          })
        }

        {volumes.length > 0 && (
          <>
            <DrawerTitle title="Volumes"/>
            {volumes.map(volume => {
              const claimName = volume.persistentVolumeClaim ? volume.persistentVolumeClaim.claimName : null;
              const configMap = volume.configMap ? volume.configMap.name : null;
              const type = Object.keys(volume)[1];

              return (
                <div key={volume.name} className="volume">
                  <div className="title flex gaps">
                    <Icon small material="storage"/>
                    <span>{volume.name}</span>
                  </div>
                  <DrawerItem name="Type">
                    {type}
                  </DrawerItem>
                  { type == "configMap" && (
                    <div>
                      {configMap && (
                        <DrawerItem name="Name">
                          <Link
                            to={getDetailsUrl(configMapApi.getUrl({
                              name: configMap,
                              namespace: pod.getNs(),
                            }))}>{configMap}
                          </Link>
                        </DrawerItem>
                      )}
                    </div>
                  )}
                  { type === "emptyDir" && (
                    <div>
                      { volume.emptyDir.medium && (
                        <DrawerItem name="Medium">
                          {volume.emptyDir.medium}
                        </DrawerItem>
                      )}
                      { volume.emptyDir.sizeLimit && (
                        <DrawerItem name="Size Limit">
                          {volume.emptyDir.sizeLimit}
                        </DrawerItem>
                      )}
                    </div>
                  )}

                  {claimName && (
                    <DrawerItem name="Claim Name">
                      <Link
                        to={getDetailsUrl(pvcApi.getUrl({
                          name: claimName,
                          namespace: pod.getNs(),
                        }))}
                      >{claimName}
                      </Link>
                    </DrawerItem>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  }
}

export const PodDetails = withInjectables<Dependencies, Props>(NonInjectedPodDetails, {
  getProps: (di, props) => ({
    ...props,
    shouldDisplayMetric: di.inject(shouldDisplayMetricInjectable),
  }),
});
