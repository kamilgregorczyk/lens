/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./cluster-view.scss";
import React from "react";
import { computed, makeObservable, reaction } from "mobx";
import { disposeOnUnmount, observer } from "mobx-react";
import type { RouteComponentProps } from "react-router";
import { ClusterStatus } from "./cluster-status";
import { ClusterFrameHandler } from "./lens-views";
import type { Cluster } from "../../../common/cluster/cluster";
import { catalogURL, ClusterViewRouteParams } from "../../../common/routes";
import { requestClusterActivation } from "../../ipc";
import type { Navigate } from "../../navigation/navigate.injectable";
import type { GetClusterById } from "../../../common/clusters/get-by-id.injectable";
import type { SetActiveEntity } from "../../catalog/entity/set-active.injectable";
import { withInjectables } from "@ogre-tools/injectable-react";
import getClusterByIdInjectable from "../../../common/clusters/get-by-id.injectable";
import navigateInjectable from "../../navigation/navigate.injectable";
import setActiveEntityInjectable from "../../catalog/entity/set-active.injectable";

interface Props extends RouteComponentProps<ClusterViewRouteParams> {
}

interface Dependencies {
  navigate: Navigate;
  getClusterById: GetClusterById;
  setActiveEntity: SetActiveEntity;
}

@observer
class NonInjectedClusterView extends React.Component<Props & Dependencies> {
  constructor(props: Props & Dependencies) {
    super(props);
    makeObservable(this);
  }

  @computed get clusterId() {
    return this.props.match.params.clusterId;
  }

  @computed get cluster(): Cluster | undefined {
    return this.props.getClusterById(this.clusterId);
  }

  @computed get isReady(): boolean {
    const { cluster, clusterId } = this;

    return cluster?.ready && cluster?.available && ClusterFrameHandler.getInstance().hasLoadedView(clusterId);
  }

  componentDidMount() {
    this.bindEvents();
  }

  componentWillUnmount() {
    ClusterFrameHandler.getInstance().clearVisibleCluster();
    this.props.setActiveEntity(null);
  }

  bindEvents() {
    disposeOnUnmount(this, [
      reaction(() => this.clusterId, async (clusterId) => {
        ClusterFrameHandler.getInstance().setVisibleCluster(clusterId);
        ClusterFrameHandler.getInstance().initView(clusterId);
        requestClusterActivation(clusterId, false); // activate and fetch cluster's state from main
        this.props.setActiveEntity(clusterId);
      }, {
        fireImmediately: true,
      }),

      reaction(() => [this.cluster?.ready, this.cluster?.disconnected], ([, disconnected]) => {
        if (ClusterFrameHandler.getInstance().hasLoadedView(this.clusterId) && disconnected) {
          this.props.navigate(catalogURL()); // redirect to catalog when active cluster get disconnected/not available
        }
      }),
    ]);
  }

  renderStatus(): React.ReactNode {
    const { cluster, isReady } = this;

    if (cluster && !isReady) {
      return <ClusterStatus cluster={cluster} className="box center"/>;
    }

    return null;
  }

  render() {
    return (
      <div className="ClusterView flex column align-center">
        {this.renderStatus()}
      </div>
    );
  }
}

export const ClusterView = withInjectables<Dependencies, Props>(NonInjectedClusterView, {
  getProps: (di, props) => ({
    ...props,
    getClusterById: di.inject(getClusterByIdInjectable),
    navigate: di.inject(navigateInjectable),
    setActiveEntity: di.inject(setActiveEntityInjectable),
  }),
});
