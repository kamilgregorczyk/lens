/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import styles from "./installed-extensions.module.scss";
import React, { useMemo } from "react";
import { Icon } from "../icon";
import { List } from "../list/list";
import { MenuActions, MenuItem } from "../menu";
import { Spinner } from "../spinner";
import { cssNames } from "../../utils";
import type { Row } from "react-table";
import type { LensExtensionId } from "../../../extensions/lens-extension";
import { withInjectables } from "@ogre-tools/injectable-react";
import extensionInstallationStateManagerInjectable from "../../../extensions/installation-state/manager.injectable";
import type { ExtensionInstallationStateManager } from "../../../extensions/installation-state/manager";
import { IObservableValue, observable } from "mobx";
import isExtensionDiscoveryLoadedInjectable from "../../extensions/discovery-is-loaded.injectable";
import type { InstalledExtension } from "../../../common/extensions/installed.injectable";
import type { IsExtensionEnabled } from "../../../common/extensions/preferences/is-enabled.injectable";

export interface InstalledExtensionsProps {
  extensions: InstalledExtension[];
  enable: (id: LensExtensionId) => void;
  disable: (id: LensExtensionId) => void;
  uninstall: (extension: InstalledExtension) => void;
  isExtensionEnabled: IsExtensionEnabled;
}

interface Dependencies {
  extensionInstallationStateStore: ExtensionInstallationStateManager;
  isExtensionDiscoveryLoaded: IObservableValue<boolean>;
}

const NonInjectedInstalledExtensions = observable(({
  extensionInstallationStateStore,
  isExtensionDiscoveryLoaded,
  extensions,
  uninstall,
  enable,
  disable,
  isExtensionEnabled,
}: Dependencies & InstalledExtensionsProps) => {
  const getStatus = ({ isBundled, id, isCompatible }: InstalledExtension) => {
    if (!isCompatible) {
      return "Incompatible";
    }

    return isExtensionEnabled(id, isBundled) ? "Enabled" : "Disabled";
  };
  const filters = [
    (extension: InstalledExtension) => extension.manifest.name,
    (extension: InstalledExtension) => getStatus(extension),
    (extension: InstalledExtension) => extension.manifest.version.raw,
  ];

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "extension",
        width: 200,
        sortType: (rowA: Row, rowB: Row) => { // Custom sorting for extension name
          const nameA = extensions[rowA.index].manifest.name;
          const nameB = extensions[rowB.index].manifest.name;

          if (nameA > nameB) return -1;
          if (nameB > nameA) return 1;

          return 0;
        },
      },
      {
        Header: "Version",
        accessor: "version",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "",
        accessor: "actions",
        disableSortBy: true,
        width: 20,
        className: "actions",
      },
    ], [],
  );

  const data = useMemo(
    () => (
      extensions.map(extension => {
        const { id, isCompatible, manifest, isBundled } = extension;
        const { name, description, version } = manifest;
        const isUninstalling = extensionInstallationStateStore.isExtensionUninstalling(id);
        const isEnabled = isExtensionEnabled(id, isBundled);

        return {
          extension: (
            <div className={"flex items-start"}>
              <div>
                <div className={styles.extensionName}>{name}</div>
                <div className={styles.extensionDescription}>{description}</div>
              </div>
            </div>
          ),
          version,
          status: (
            <div className={cssNames({ [styles.enabled]: isEnabled, [styles.invalid]: !isCompatible })}>
              {getStatus(extension)}
            </div>
          ),
          actions: (
            <MenuActions usePortal toolbar={false}>
              { isCompatible && (
                <>
                  {isEnabled ? (
                    <MenuItem
                      disabled={isUninstalling}
                      onClick={() => disable(id)}
                    >
                      <Icon material="unpublished"/>
                      <span className="title" aria-disabled={isUninstalling}>Disable</span>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      disabled={isUninstalling}
                      onClick={() => enable(id)}
                    >
                      <Icon material="check_circle"/>
                      <span className="title" aria-disabled={isUninstalling}>Enable</span>
                    </MenuItem>
                  )}
                </>
              )}

              <MenuItem
                disabled={isUninstalling}
                onClick={() => uninstall(extension)}
              >
                <Icon material="delete"/>
                <span className="title" aria-disabled={isUninstalling}>Uninstall</span>
              </MenuItem>
            </MenuActions>
          ),
        };
      })
    ), [extensions, extensionInstallationStateStore.anyUninstalling],
  );

  if (!isExtensionDiscoveryLoaded.get()) {
    return <div><Spinner center /></div>;
  }

  if (extensions.length == 0) {
    return (
      <div className="flex column h-full items-center justify-center">
        <Icon material="extension" className={styles.noItemsIcon}/>
        <h3 className="font-medium text-3xl mt-5 mb-2">
          There are no extensions installed.
        </h3>
        <p>Please use the form above to install or drag tarbar-file here.</p>
      </div>
    );
  }

  return (
    <section data-testid="extensions-table">
      <List
        title={<h2 className={styles.title}>Installed extensions</h2>}
        columns={columns}
        data={data}
        items={extensions}
        filters={filters}
      />
    </section>
  );
});

export const InstalledExtensions = withInjectables<Dependencies, InstalledExtensionsProps>(NonInjectedInstalledExtensions, {
  getProps: (di, props) => ({
    ...props,
    extensionInstallationStateStore: di.inject(extensionInstallationStateManagerInjectable),
    isExtensionDiscoveryLoaded: di.inject(isExtensionDiscoveryLoadedInjectable),
  }),
});
