/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, InjectionToken, lifecycleEnum } from "@ogre-tools/injectable";
import { CatalogEntityRegistry } from "./registry";
import getEntityForDataInjectable from "../category/get-entity-for-data.injectable";
import navigateInjectable from "../../navigation/navigate.injectable";
import catalogEntityRegistryLoggerInjectable from "../../../common/catalog/entity/registry-logger.injectable";
import { catalogEntityRegistryInjectionToken } from "../../../common/catalog/entity/registry.token";

const catalogEntityRegistryInjectable = getInjectable({
  instantiate: (di) => new CatalogEntityRegistry({
    getEntityForData: di.inject(getEntityForDataInjectable),
    navigate: di.inject(navigateInjectable),
    logger: di.inject(catalogEntityRegistryLoggerInjectable),
  }),
  injectionToken: catalogEntityRegistryInjectionToken as InjectionToken<CatalogEntityRegistry, void>,
  lifecycle: lifecycleEnum.singleton,
});

export default catalogEntityRegistryInjectable;
