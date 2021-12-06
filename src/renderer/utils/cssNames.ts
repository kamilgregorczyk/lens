/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

// Helper for combining css classes inside components

export type IClassName = string | string[] | Record<string, any>;

export function cssNames(...args: IClassName[]): string {
  const map: Record<string, any> = {};

  for (const arg of args) {
    if (typeof arg === "string") {
      map[arg] = true;
    } else if (Array.isArray(arg)) {
      for (const className of arg) {
        map[className] = true;
      }
    } else {
      Object.assign(map, arg);
    }
  }

  return Object.entries(map)
    .filter(([, isActive]) => isActive)
    .map(([className]) => className.trim())
    .join(" ");
}
