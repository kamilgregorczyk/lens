/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */


import "./command-container.scss";
import { disposeOnUnmount, observer } from "mobx-react";
import React from "react";
import { Dialog } from "../dialog";
import { CommandDialog } from "./command-dialog";
import type { ClusterId } from "../../../common/cluster-types";
import commandOverlayInjectable, { CommandOverlay } from "./command-overlay.injectable";
import { isMac } from "../../../common/vars";
import { getMatchedClusterId } from "../../navigation";
import type { Disposer } from "../../utils";
import { withInjectables } from "@ogre-tools/injectable-react";
import windowAddEventListenerInjectable from "../../window/event-listener.injectable";
import type { OpenCommandPallet } from "../../../common/ipc/command-pallet/open.injectable";
import openCommandPalletInjectable from "../../../common/ipc/command-pallet/open.injectable";
import type { ListenForOpen } from "../../ipc/command-pallet/listen-for-open.injectable";
import listenForOpenInjectable from "../../ipc/command-pallet/listen-for-open.injectable";

export interface CommandContainerProps {
  clusterId?: ClusterId;
}

interface Dependencies {
  addWindowEventListener: <K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => Disposer;
  commandOverlay: CommandOverlay,
  openCommandPallet: OpenCommandPallet;
  listenForOpen: ListenForOpen;
}

@observer
class NonInjectedCommandContainer extends React.Component<CommandContainerProps & Dependencies> {
  private escHandler(event: KeyboardEvent) {
    const { commandOverlay } = this.props;

    if (event.key === "Escape") {
      event.stopPropagation();
      commandOverlay.close();
    }
  }

  openDialog = () => this.props.commandOverlay.open(<CommandDialog />);

  handleCommandPalette = () => {
    const clusterId = getMatchedClusterId();

    if (clusterId) {
      this.props.openCommandPallet(clusterId);
    } else {
      this.openDialog();
    }
  };

  onKeyboardShortcut(action: () => void) {
    return ({ key, shiftKey, ctrlKey, altKey, metaKey }: KeyboardEvent) => {
      const ctrlOrCmd = isMac ? metaKey && !ctrlKey : !metaKey && ctrlKey;

      if (key === "p" && shiftKey && ctrlOrCmd && !altKey) {
        action();
      }
    };
  }

  componentDidMount() {
    const { clusterId, addWindowEventListener, listenForOpen } = this.props;
    const action = clusterId
      ? this.openDialog
      : this.handleCommandPalette;

    disposeOnUnmount(this, [
      listenForOpen(clusterId, action),
      addWindowEventListener("keydown", this.onKeyboardShortcut(action)),
      addWindowEventListener("keyup", (e) => this.escHandler(e), true),
    ]);
  }

  render() {
    const { commandOverlay } = this.props;

    return (
      <Dialog
        isOpen={commandOverlay.isOpen}
        animated={true}
        onClose={commandOverlay.close}
        modal={false}
      >
        <div id="command-container">
          {commandOverlay.component}
        </div>
      </Dialog>
    );
  }
}

export const CommandContainer = withInjectables<Dependencies, CommandContainerProps>(NonInjectedCommandContainer, {
  getProps: (di, props) => ({
    addWindowEventListener: di.inject(windowAddEventListenerInjectable),
    commandOverlay: di.inject(commandOverlayInjectable),
    openCommandPallet: di.inject(openCommandPalletInjectable),
    listenForOpen: di.inject(listenForOpenInjectable),
    ...props,
  }),
});
