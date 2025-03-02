/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import styles from "./cluster-status.module.scss";

import { computed, observable, makeObservable } from "mobx";
import { disposeOnUnmount, observer } from "mobx-react";
import React from "react";
import { ipcRendererOn } from "../../../common/ipc";
import type { Cluster } from "../../../common/cluster/cluster";
import { cssNames, IClassName } from "../../utils";
import { Button } from "../button";
import { Icon } from "../icon";
import { Spinner } from "../spinner";
import { navigate } from "../../navigation";
import { entitySettingsURL } from "../../../common/routes";
import type { KubeAuthUpdate } from "../../../common/cluster-types";
import { catalogEntityRegistry } from "../../api/catalog-entity-registry";
import { requestClusterActivation } from "../../ipc";

interface Props {
  className?: IClassName;
  cluster: Cluster;
}

@observer
export class ClusterStatus extends React.Component<Props> {
  @observable authOutput: KubeAuthUpdate[] = [];
  @observable isReconnecting = false;

  constructor(props: Props) {
    super(props);
    makeObservable(this);
  }

  get cluster(): Cluster {
    return this.props.cluster;
  }

  @computed get entity() {
    return catalogEntityRegistry.getById(this.cluster.id);
  }

  @computed get hasErrors(): boolean {
    return this.authOutput.some(({ isError }) => isError);
  }

  componentDidMount() {
    disposeOnUnmount(this, [
      ipcRendererOn(`cluster:${this.cluster.id}:connection-update`, (evt, res: KubeAuthUpdate) => {
        this.authOutput.push(res);
      }),
    ]);
  }

  reconnect = async () => {
    this.authOutput = [];
    this.isReconnecting = true;

    try {
      await requestClusterActivation(this.cluster.id, true);
    } catch (error) {
      this.authOutput.push({
        message: error.toString(),
        isError: true,
      });
    } finally {
      this.isReconnecting = false;
    }
  };

  manageProxySettings = () => {
    navigate(entitySettingsURL({
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
