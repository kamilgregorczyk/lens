/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./cluster-manager.scss";

import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { disposeOnUnmount, observer } from "mobx-react";
import { StatusBar } from "../status-bar/status-bar";
import { Catalog } from "../+catalog";
import { Preferences } from "../+preferences";
import { AddCluster } from "../+add-cluster";
import { ClusterView } from "./cluster-view";
import { GlobalPageRegistry } from "../../../extensions/registries/page-registry";
import { Extensions } from "../+extensions";
import { HotbarMenu } from "../hotbar/hotbar-menu";
import { EntitySettings } from "../+entity-settings";
import { Welcome } from "../+welcome";
import * as routes from "../../../common/routes";
import { DeleteClusterDialog } from "../delete-cluster-dialog";
import { reaction } from "mobx";
import { catalogURL, getPreviousTabUrl } from "../../../common/routes";
import { withInjectables } from "@ogre-tools/injectable-react";
import { TopBar } from "../layout/top-bar/top-bar";
import catalogPreviousActiveTabStorageInjectable from "../+catalog/catalog-previous-active-tab-storage/catalog-previous-active-tab-storage.injectable";
import type { CatalogEntityRegistry } from "../../catalog/entity/registry";
import type { CatalogCategoryRegistry } from "../../catalog/category/registry";
import type { ObservableHistory } from "mobx-observable-history";
import { isActiveRoute } from "../../navigation";
import catalogCategoryRegistryInjectable from "../../catalog/category/registry.injectable";
import catalogEntityRegistryInjectable from "../../catalog/entity/registry.injectable";
import observableHistoryInjectable from "../../navigation/observable-history.injectable";

interface Dependencies {
  catalogPreviousActiveTabStorage: { get: () => string };
  entityRegistry: CatalogEntityRegistry;
  categoryRegistry: CatalogCategoryRegistry;
  navigation: ObservableHistory;
}

@observer
class NonInjectedClusterManager extends React.Component<Dependencies> {
  componentDidMount() {
    disposeOnUnmount(this, [
      reaction(
        () => [this.props.navigation.location, this.props.entityRegistry.entities.get().length > 0] as const,
        ([, hasEntities]) => {
          if (hasEntities) {
            const entities = this.props.entityRegistry.getItemsForCategory(this.props.categoryRegistry.getByName("General"));
            const activeEntity = entities.find(entity => isActiveRoute(entity.spec.path));

            if (activeEntity) {
              this.props.entityRegistry.setActiveEntity(activeEntity);
            }
          }
        },
        {
          fireImmediately: true,
        }),
    ]);
  }

  render() {
    return (
      <div className="ClusterManager">
        <TopBar />
        <main>
          <div id="lens-views" />
          <Switch>
            <Redirect
              exact
              from={catalogURL()}
              to={getPreviousTabUrl(
                this.props.catalogPreviousActiveTabStorage.get(),
              )}
            />

            <Route component={Welcome} {...routes.welcomeRoute} />
            <Route component={Catalog} {...routes.catalogRoute} />
            <Route component={Preferences} {...routes.preferencesRoute} />
            <Route component={Extensions} {...routes.extensionsRoute} />
            <Route component={AddCluster} {...routes.addClusterRoute} />
            <Route component={ClusterView} {...routes.clusterViewRoute} />
            <Route component={EntitySettings} {...routes.entitySettingsRoute} />
            {GlobalPageRegistry.getInstance()
              .getItems()
              .map(({ url, components: { Page }}) => (
                <Route key={url} path={url} component={Page} />
              ))}
            <Redirect exact to={routes.welcomeURL()} />
          </Switch>
        </main>
        <HotbarMenu />
        <StatusBar />
        <DeleteClusterDialog />
      </div>
    );
  }
}

export const ClusterManager = withInjectables<Dependencies>(NonInjectedClusterManager, {
  getProps: di => ({
    catalogPreviousActiveTabStorage: di.inject(catalogPreviousActiveTabStorageInjectable),
    categoryRegistry: di.inject(catalogCategoryRegistryInjectable),
    entityRegistry: di.inject(catalogEntityRegistryInjectable),
    navigation: di.inject(observableHistoryInjectable),
  }),
});
