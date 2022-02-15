/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import styles from "./cluster-status.module.scss";

import { computed, observable, makeObservable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import type { Cluster } from "../../../common/clusters/cluster";
import { cssNames, IClassName } from "../../utils";
import { Button } from "../button";
import { Icon } from "../icon";
import { Spinner } from "../spinner";
import { entitySettingsURL } from "../../../common/routes";
import type { KubeAuthUpdate } from "../../../common/cluster-types";
import { requestClusterActivation } from "../../ipc";
import { withInjectables } from "@ogre-tools/injectable-react";
import clusterConnectionStatusStateInjectable, { ClusterConnectionStatus } from "./status-state.injectable";
import type { Navigate } from "../../navigation/navigate.injectable";
import navigateInjectable from "../../navigation/navigate.injectable";
import type { GetEntityById } from "../../../common/catalog/entity/get-by-id.injectable";
import getEntityByIdInjectable from "../../../common/catalog/entity/get-by-id.injectable";

export interface ClusterStatusProps {
  className?: IClassName;
  cluster: Cluster;
}

interface Dependencies {
  state: ClusterConnectionStatus;
  navigate: Navigate;
  getEntityById: GetEntityById;
}

@observer
class NonInjectedClusterStatus extends React.Component<ClusterStatusProps & Dependencies> {
  @observable isReconnecting = false;

  constructor(props: ClusterStatusProps & Dependencies) {
    super(props);
    makeObservable(this);
  }

  get cluster(): Cluster {
    return this.props.cluster;
  }

  @computed get entity() {
    return this.props.getEntityById(this.cluster.id);
  }

  hasErrors(authOutput: KubeAuthUpdate[]): boolean {
    return authOutput.some(({ isError }) => isError);
  }

  @computed get authOutput() {
    return this.props.state.get(this.cluster.id);
  }

  clearAuthOutput() {
    this.props.state.clear(this.cluster.id);
  }

  reconnect = async () => {
    this.clearAuthOutput();
    this.isReconnecting = true;

    try {
      await requestClusterActivation(this.cluster.id, true);
    } catch (error) {
      this.props.state.push(this.cluster.id, {
        message: error.toString(),
        isError: true,
      });
    } finally {
      this.isReconnecting = false;
    }
  };

  manageProxySettings = () => {
    this.props.navigate(entitySettingsURL({
      params: {
        entityId: this.cluster.id,
      },
      fragment: "proxy",
    }));
  };

  renderAuthenticationOutput() {
    return (
      <pre>
        {
          this.authOutput.map(({ message, isError }, index) => (
            <p key={index} className={cssNames({ error: isError })}>
              {message.trim()}
            </p>
          ))
        }
      </pre>
    );
  }

  renderStatusIcon() {
    if (this.hasErrors) {
      return <Icon material="cloud_off" className={styles.icon} />;
    }

    return (
      <>
        <Spinner singleColor={false} className={styles.spinner} />
        <pre className="kube-auth-out">
          <p>{this.isReconnecting ? "Reconnecting" : "Connecting"}&hellip;</p>
        </pre>
      </>
    );
  }

  renderReconnectionHelp() {
    if (this.hasErrors && !this.isReconnecting) {
      return (
        <>
          <Button
            primary
            label="Reconnect"
            className="box center"
            onClick={this.reconnect}
            waiting={this.isReconnecting}
          />
          <a
            className="box center interactive"
            onClick={this.manageProxySettings}
          >
            Manage Proxy Settings
          </a>
        </>
      );
    }

    return undefined;
  }

  render() {
    return (
      <div className={cssNames(styles.status, "flex column box center align-center justify-center", this.props.className)}>
        <div className="flex items-center column gaps">
          <h2>{this.entity?.getName() ?? this.cluster.name}</h2>
          {this.renderStatusIcon()}
          {this.renderAuthenticationOutput()}
          {this.renderReconnectionHelp()}
        </div>
      </div>
    );
  }
}

export const ClusterStatus = withInjectables<Dependencies, ClusterStatusProps>(NonInjectedClusterStatus, {
  getProps: (di, props) => ({
    ...props,
    state: di.inject(clusterConnectionStatusStateInjectable),
    navigate: di.inject(navigateInjectable),
    getEntityById: di.inject(getEntityByIdInjectable),
  }),
});
