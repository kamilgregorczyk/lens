/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import React from "react";

import {
  render as testingLibraryRender,
  RenderResult,
} from "@testing-library/react";

import type { DependencyInjectionContainer } from "@ogre-tools/injectable";

import { DiContextProvider } from "@ogre-tools/injectable-react";

export type DiRender = (ui: React.ReactElement) => RenderResult;

type DiRenderFor = (di: DependencyInjectionContainer) => DiRender;

export const renderFor: DiRenderFor = (di) => (ui) => {
  const result = testingLibraryRender(
    <DiContextProvider value={{ di }}>{ui}</DiContextProvider>,
  );

  return {
    ...result,

    rerender: (ui: React.ReactElement) => result.rerender(
      <DiContextProvider value={{ di }}>{ui}</DiContextProvider>,
    ),
  };
};
