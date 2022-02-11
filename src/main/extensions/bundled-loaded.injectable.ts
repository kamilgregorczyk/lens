/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import EventEmitter from "events";
import type TypedEventEmitter from "typed-emitter";

export interface BundledExtensionsEvents {
  loaded: () => void;
}

const bundledExtensionsEventEmitterInjectable = getInjectable({
  instantiate: () => new EventEmitter() as TypedEventEmitter<BundledExtensionsEvents>,
  lifecycle: lifecycleEnum.singleton,
});

export default bundledExtensionsEventEmitterInjectable;
