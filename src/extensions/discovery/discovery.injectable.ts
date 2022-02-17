/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { ExtensionDiscovery } from "./discovery";
import extensionLoaderInjectable from "../extension-loader/extension-loader.injectable";
import isCompatibleExtensionInjectable from "./is-compatible-extension/is-compatible-extension.injectable";
import isCompatibleBundledExtensionInjectable from "./is-compatible-bundled-extension/is-compatible-bundled-extension.injectable";
import extensionInstallationStateStoreInjectable from "../extension-installation-state-store/extension-installation-state-store.injectable";
import installExtensionInjectable from "../extension-installer/install-extension/install-extension.injectable";
import extensionPackageRootDirectoryInjectable from "../extension-installer/extension-package-root-directory/extension-package-root-directory.injectable";
import installExtensionsInjectable from "../extension-installer/install-extensions/install-extensions.injectable";
import { extensionsStoreInjectionToken } from "../../common/extensions/store-injection-token";
import isProductionInjectable from "../../common/vars/is-production.injectable";
import extensionsDiscoverLoggerInjectable from "./logger.injectable";

const extensionDiscoveryInjectable = getInjectable({
  instantiate: (di) => new ExtensionDiscovery({
    extensionLoader: di.inject(extensionLoaderInjectable),
    extensionsStore: di.inject(extensionsStoreInjectionToken),
    extensionInstallationStateStore: di.inject(extensionInstallationStateStoreInjectable),
    isCompatibleBundledExtension: di.inject(isCompatibleBundledExtensionInjectable),
    isCompatibleExtension: di.inject(isCompatibleExtensionInjectable),
    installExtension: di.inject(installExtensionInjectable),
    installExtensions: di.inject(installExtensionsInjectable),
    extensionPackageRootDirectory: di.inject(extensionPackageRootDirectoryInjectable),
    isProduction: di.inject(isProductionInjectable),
    logger: di.inject(extensionsDiscoverLoggerInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,
});

export default extensionDiscoveryInjectable;
