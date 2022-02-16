/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { injectSystemCAs } from "../../../common/system-ca";
import React from "react";
import { Route, Router, Switch } from "react-router";
import { observer } from "mobx-react";
import { ClusterManager } from "../../components/cluster-manager";
import { ErrorBoundary } from "../../components/error-boundary";
import { ConfirmDialog } from "../../components/confirm-dialog";
import { CommandContainer } from "../../components/command-palette/command-container";
import historyInjectable from "../../navigation/history.injectable";
import { withInjectables } from "@ogre-tools/injectable-react";
import type { History } from "history";
import type { WindowLoaded } from "../../../common/ipc/window/loaded.token";
import emitWindowLoadedInjectable from "../../ipc/window/loaded.injectable";
import { NotificationsList } from "../../components/notifications/list";

injectSystemCAs();

interface Dependencies {
  history: History;
  emitWindowLoaded: WindowLoaded;
}

@observer
class NonInjectedRootFrame extends React.Component<Dependencies> {
  static displayName = "RootFrame";

  componentDidMount() {
    /**
     * Both the `setTimeout` and `window.requestAnimationFrame` are required for
     * the final callback to be invoked only after React has fully flushed
     * the first render draw to the screen.
     */
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        this.props.emitWindowLoaded();
      });
    });
  }

  render() {
    return (
      <Router history={this.props.history}>
        <ErrorBoundary>
          <Switch>
            <Route component={ClusterManager} />
          </Switch>
        </ErrorBoundary>
        <NotificationsList />
        <ConfirmDialog />
        <CommandContainer />
      </Router>
    );
  }
}

export const RootFrame = withInjectables(NonInjectedRootFrame, {
  getProps: (di) => ({
    history: di.inject(historyInjectable),
    emitWindowLoaded: di.inject(emitWindowLoadedInjectable),
  }),
});
