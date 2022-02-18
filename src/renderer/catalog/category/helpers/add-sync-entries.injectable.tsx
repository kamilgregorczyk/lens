/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { runInAction } from "mobx";
import React from "react";
import { Link } from "react-router-dom";
import { kubernetesURL } from "../../../../common/routes";
import type { UserPreferencesStore } from "../../../../common/user-preferences/store";
import { getAllEntries } from "../../../components/+preferences/kubeconfig-syncs";
import type { OkNotification } from "../../../components/notifications/ok.injectable";
import { multiSet } from "../../../utils";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import okNotificationInjectable from "../../../components/notifications/ok.injectable";
import userPreferencesStoreInjectableInjectable from "../../../user-preferences/store.injectable";

export type AddSyncEntries = (filePaths: string[]) => Promise<void>;

interface Dependencies {
  userPreferencesStore: UserPreferencesStore;
  okNotification: OkNotification;
}

const addSyncEntries = ({
  userPreferencesStore,
  okNotification,
}: Dependencies): AddSyncEntries => (
  async (filePaths) => {
    const entries = await getAllEntries(filePaths);

    runInAction(() => {
      multiSet(userPreferencesStore.syncKubeconfigEntries, entries);
    });

    okNotification(
      <div>
        <p>Selected items has been added to Kubeconfig Sync.</p><br/>
        <p>Check the <Link style={{ textDecoration: "underline" }} to={`${kubernetesURL()}#kube-sync`}>Preferences</Link>{" "}
        to see full list.</p>
      </div>,
    );
  }
);

const addSyncEntriesInjectable = getInjectable({
  instantiate: (di) => addSyncEntries({
    okNotification: di.inject(okNotificationInjectable),
    userPreferencesStore: di.inject(userPreferencesStoreInjectableInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default addSyncEntriesInjectable;

