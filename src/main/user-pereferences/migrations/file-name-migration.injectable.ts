/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import path from "path";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import directoryForUserDataInjectable from "../../../common/paths/user-data.injectable";
import moveInjectable from "../../../common/fs/move.injectable";
import removeInjectable from "../../../common/fs/remove.injectable";

interface Dependencies {
  userDataPath: string;
  move: (fromPath: string, toPath: string) => Promise<void>;
  remove: (path: string) => Promise<void>;
}

const fileNameMigration = ({ userDataPath, move, remove }: Dependencies) => (
  async () => {
    const configJsonPath = path.join(userDataPath, "config.json");
    const lensUserStoreJsonPath = path.join(userDataPath, "lens-user-store.json");

    try {
      move(configJsonPath, lensUserStoreJsonPath);
    } catch (error) {
      if (error.code === "ENOENT" && error.path === configJsonPath) { // (No such file or directory)
        return; // file already moved
      } else if (error.message === "dest already exists.") {
        remove(configJsonPath);
      } else {
        // pass other errors along
        throw error;
      }
    }
  }
);


const fileNameMigrationInjectable = getInjectable({
  instantiate: (di) => fileNameMigration({
    userDataPath: di.inject(directoryForUserDataInjectable),
    move: di.inject(moveInjectable),
    remove: di.inject(removeInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default fileNameMigrationInjectable;

