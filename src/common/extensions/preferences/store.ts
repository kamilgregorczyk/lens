/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { action, computed, makeObservable, observable } from "mobx";
import { toJS } from "../../utils";
import { BaseStore, BaseStoreDependencies, BaseStoreParams } from "../../base-store";
import type { LensExtensionId } from "../manifest";
import type { InstalledExtension } from "../installed.injectable";

export interface ExtensionsPreferencesStoreModel {
  extensions: Record<LensExtensionId, LensExtensionState>;
}

export interface LensExtensionState {
  enabled?: boolean;
  name: string;
}

export interface ExtensionsPreferencesDependencies extends BaseStoreDependencies {}

export class ExtensionsPreferencesStore extends BaseStore<ExtensionsPreferencesStoreModel> {
  constructor(deps: ExtensionsPreferencesDependencies, params: BaseStoreParams<ExtensionsPreferencesStoreModel>) {
    super(deps, {
      ...params,
      name: "lens-extensions",
    });
    makeObservable(this);
    this.load();
  }

  readonly enabledExtensions = computed(() => (
    Array.from(this.state.values())
      .filter(({ enabled }) => enabled)
      .map(({ name }) => name)
  ));

  protected state = observable.map<LensExtensionId, LensExtensionState>();

  isEnabled({ isBundled, id }: Pick<InstalledExtension, "id" | "isBundled">): boolean {
    // By default false, so that copied extensions are disabled by default.
    // If user installs the extension from the UI, the Extensions component will specifically enable it.
    return isBundled || Boolean(this.state.get(id)?.enabled);
  }

  mergeState(extensionsState: Partial<Record<LensExtensionId, LensExtensionState>>) {
    this.state.merge(extensionsState);
  }

  @action
  protected fromStore({ extensions }: ExtensionsPreferencesStoreModel) {
    this.state.merge(extensions);
  }

  toJSON(): ExtensionsPreferencesStoreModel {
    return toJS({
      extensions: Object.fromEntries(this.state),
    });
  }
}
