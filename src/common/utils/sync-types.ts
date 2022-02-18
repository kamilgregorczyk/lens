/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

/**
 * This type is useful for making sure that sync message types have a consistent
 * varient field.
 */
export interface SyncMessage<Variant extends string> {
  type: Variant;
}
