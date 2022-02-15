/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { Disposer } from "../../utils";
import type { EntityFilter } from "./registry";

export type AddEntityFilter = (fn: EntityFilter) => Disposer;
