/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import styles from "./hotbar-entity-icon.module.scss";

import React, { HTMLAttributes } from "react";
import { IComputedValue, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";

import { cssNames, IClassName } from "../../utils";
import { Icon } from "../icon";
import { HotbarIcon } from "./hotbar-icon";
import { LensKubernetesClusterStatus } from "../../../common/catalog-entities/kubernetes-cluster";
import type { CatalogEntity, CatalogEntityContextMenu, NavigateAction } from "../../../common/catalog/entity/entity";
import { withInjectables } from "@ogre-tools/injectable-react";
import type { GetCategoryForEntity } from "../../catalog/category/get-for-entity.injectable";
import activeEntityInjectable from "../../catalog/entity/active-entity.injectable";
import getCategoryForEntityInjectable from "../../catalog/category/get-for-entity.injectable";
import navigateActionInjectable from "../../window/navigate-action.injectable";

export interface HotbarEntityIconProps extends HTMLAttributes<HTMLElement> {
  entity: CatalogEntity;
  index: number;
  errorClass?: IClassName;
  add: (item: CatalogEntity, index: number) => void;
  remove: (uid: string) => void;
  size?: number;
}

interface Dependencies {
  activeEntity: IComputedValue<CatalogEntity | undefined>;
  getCategoryForEntity: GetCategoryForEntity;
  navigate: NavigateAction;
}

@observer
class NonInjectedHotbarEntityIcon extends React.Component<HotbarEntityIconProps & Dependencies> {
  private readonly menuItems = observable.array<CatalogEntityContextMenu>();

  constructor(props: HotbarEntityIconProps & Dependencies) {
    super(props);
    makeObservable(this);
  }

  get kindIcon() {
    const className = styles.badge;
    const category = this.props.getCategoryForEntity(this.props.entity);

    if (!category) {
      return <Icon material="bug_report" className={className} />;
    }

    if (category.metadata.icon.includes("<svg")) {
      return <Icon svg={category.metadata.icon} className={className} />;
    } else {
      return <Icon material={category.metadata.icon} className={className} />;
    }
  }

  get ledIcon() {
    if (this.props.entity.kind !== "KubernetesCluster") {
      return null;
    }

    const className = cssNames(styles.led, { [styles.online]: this.props.entity.status.phase === LensKubernetesClusterStatus.CONNECTED }); // TODO: make it more generic

    return <div className={className} />;
  }

  isActive(item: CatalogEntity) {
    return this.props.activeEntity.get()?.metadata?.uid == item.getId();
  }

  onMenuOpen() {
    this.menuItems.replace([{
      title: "Remove from Hotbar",
      onClick: () => this.props.remove(this.props.entity.getId()),
    }]);

    this.props.entity.onContextMenuOpen({
      menuItems: this.menuItems,
      navigate: this.props.navigate,
    });
  }

  render() {
    const { entity, errorClass, add, remove, index, children, ...elemProps } = this.props;

    return (
      <HotbarIcon
        uid={entity.getId()}
        title={entity.getName()}
        source={entity.metadata.source}
        src={entity.spec.icon?.src}
        material={entity.spec.icon?.material}
        background={entity.spec.icon?.background}
        className={this.props.className}
        active={this.isActive(entity)}
        onMenuOpen={() => this.onMenuOpen()}
        disabled={!entity}
        menuItems={this.menuItems}
        tooltip={`${entity.getName()} (${entity.metadata.source})`}
        {...elemProps}
      >
        { this.ledIcon }
        { this.kindIcon }
      </HotbarIcon>
    );
  }
}

export const HotbarEntityIcon = withInjectables<Dependencies, HotbarEntityIconProps>(NonInjectedHotbarEntityIcon, {
  getProps: (di, props) => ({
    ...props,
    activeEntity: di.inject(activeEntityInjectable),
    getCategoryForEntity: di.inject(getCategoryForEntityInjectable),
    navigate: di.inject(navigateActionInjectable),
  }),
});
