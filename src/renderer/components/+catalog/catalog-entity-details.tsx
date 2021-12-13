/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import styles from "./catalog-entity-details.module.scss";
import React, { Component } from "react";
import { observer } from "mobx-react";
import { Drawer, DrawerItem } from "../drawer";
import type { CatalogCategory, CatalogEntity } from "../../../common/catalog";
import { Icon } from "../icon";
import { CatalogEntityDrawerMenu } from "./catalog-entity-drawer-menu";
import { CatalogEntityDetailRegistry } from "../../../extensions/registries";
import { isDevelopment } from "../../../common/vars";
import { cssNames } from "../../utils";
import { Avatar } from "../avatar";
import { getIconColourHash } from "../../../common/catalog/helpers";
import { EntityIcon } from "../entity-icon";
import { getLabelBadges } from "./helpers";

interface Props {
  entity: CatalogEntity | null | undefined;
  hideDetails(): void;
  onRun: () => void;
}

@observer
export class CatalogEntityDetails extends Component<Props> {
  categoryIcon(category: CatalogCategory) {
    const key = category.metadata.icon.includes("<svg") ? "svg" : "material";

    return <Icon {...{ [key]: category.metadata.icon }} smallest />;
  }

  renderContent(entity: CatalogEntity | undefined, onRun: () => void) {
    if (!entity) {
      return null;
    }

    const detailItems = CatalogEntityDetailRegistry.getInstance().getItemsForKind(entity.kind, entity.apiVersion);
    const details = detailItems.map(({ components }, index) => <components.Details entity={entity} key={index} />);
    const showDetails = detailItems.find((item) => item.priority > 999) === undefined;

    return (
      <>
        {showDetails && (
          <div className="flex">
            <div className={styles.entityIcon}>
              <Avatar
                colorHash={getIconColourHash(entity)}
                size={128}
                data-testid="detail-panel-hot-bar-icon"
                background={entity.spec.icon?.background}
                onClick={onRun}
                className={styles.avatar}
              >
                <EntityIcon entity={entity} />
              </Avatar>
              {entity?.isEnabled() && (
                <div className={styles.hint}>
                  Click to open
                </div>
              )}
            </div>
            <div className={cssNames("box grow", styles.metadata)}>
              <DrawerItem name="Name">
                {entity.getName()}
              </DrawerItem>
              <DrawerItem name="Kind">
                {entity.kind}
              </DrawerItem>
              <DrawerItem name="Source">
                {entity.getSource()}
              </DrawerItem>
              <DrawerItem name="Status">
                {entity.status.phase}
              </DrawerItem>
              <DrawerItem name="Labels">
                {...getLabelBadges(entity, this.props.hideDetails)}
              </DrawerItem>
              {isDevelopment && (
                <DrawerItem name="Id">
                  {entity.getId()}
                </DrawerItem>
              )}
            </div>
          </div>
        )}
        <div className="box grow">
          {details}
        </div>
      </>
    );
  }

  render() {
    const { entity, hideDetails, onRun } = this.props;

    return (
      <Drawer
        className={styles.entityDetails}
        usePortal={true}
        open={true}
        title={`${entity.kind}: ${entity.getName()}`}
        toolbar={<CatalogEntityDrawerMenu entity={entity} key={entity.getId()} />}
        onClose={hideDetails}
      >
        {this.renderContent(entity, onRun)}
      </Drawer>
    );
  }
}
