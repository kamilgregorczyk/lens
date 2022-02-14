/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { MenuItemConstructorOptions } from "electron";
import type { MenuTopId } from "./menu-template.injectable";

export interface MenuRegistration extends MenuItemConstructorOptions {
  parentId: MenuTopId;
}
