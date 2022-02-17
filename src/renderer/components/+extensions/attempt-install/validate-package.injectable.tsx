/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { LensExtensionManifest } from "../../../../extensions/lens-extension";
import { listTarEntries, readFileFromTar } from "../../../../common/utils";
import path from "path";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import manifestFilenameInjectable from "../../../../common/vars/manifest-filename.injectable";

export type ValidatePackage = (filePath: string) => Promise<LensExtensionManifest>;

interface Dependencies {
  manifestFilename: string;
}

const validatePackage = ({
  manifestFilename,
}: Dependencies): ValidatePackage => (
  async (filePath) => {
    const tarFiles = await listTarEntries(filePath);

    // tarball from npm contains single root folder "package/*"
    const firstFile = tarFiles[0];

    if (!firstFile) {
      throw new Error(`invalid extension bundle,  ${manifestFilename} not found`);
    }

    const rootFolder = path.normalize(firstFile).split(path.sep)[0];
    const packedInRootFolder = tarFiles.every(entry =>
      entry.startsWith(rootFolder),
    );
    const manifestLocation = packedInRootFolder
      ? path.join(rootFolder, manifestFilename)
      : manifestFilename;

    if (!tarFiles.includes(manifestLocation)) {
      throw new Error(`invalid extension bundle, ${manifestFilename} not found`);
    }

    const manifest = await readFileFromTar<LensExtensionManifest>({
      tarPath: filePath,
      filePath: manifestLocation,
      parseJson: true,
    });

    if (!manifest.main && !manifest.renderer) {
      throw new Error(
        `${manifestFilename} must specify at least one of "main" and "renderer" fields`,
      );
    }

    return manifest;
  }
);

const validatePackageInjectable = getInjectable({
  instantiate: (di) => validatePackage({
    manifestFilename: di.inject(manifestFilenameInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default validatePackageInjectable;
