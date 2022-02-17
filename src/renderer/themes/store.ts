/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { computed, IComputedValue, observable, reaction } from "mobx";
import lensDarkThemeJson from "./lens-dark.json";
import lensLightThemeJson from "./lens-light.json";
import type { MonacoEditorProps } from "../components/monaco-editor";
import { defaultTheme } from "../../common/vars";
import type { LensLogger } from "../../common/logger";

export type ThemeId = string;

export interface Theme {
  name: string;
  type: "dark" | "light";
  colors: Record<string, string>;
  terminalColors: Record<string, string>;
  description: string;
  author: string;
  monacoTheme: MonacoEditorProps["theme"];
}

export interface ThemeStoreDependencies {
  readonly activeThemeId: IComputedValue<ThemeId>;
  readonly activeTerminalThemeId: IComputedValue<ThemeId>;
  resetTheme: () => void;
  readonly logger: LensLogger;
}

export class ThemeStore {
  // bundled themes from `themes/${themeId}.json`
  private themes = observable.map<ThemeId, Theme>({
    "lens-dark": lensDarkThemeJson as Theme,
    "lens-light": lensLightThemeJson as Theme,
  });

  readonly activeTheme = computed(() => (
    this.themes.get(this.dependencies.activeThemeId.get()) ?? this.themes.get(defaultTheme)
  ));

  readonly terminalColors = computed(() => (
    (this.themes.get(this.dependencies.activeTerminalThemeId.get()) ?? this.activeTheme.get()).terminalColors
  ));

  readonly themeOptions = computed(() => Array.from(
    this.themes,
    ([themeId, theme]) => ({
      label: theme.name,
      value: themeId,
    }),
  ));

  constructor(protected readonly dependencies: ThemeStoreDependencies) {
    // auto-apply active theme
    reaction(
      () => this.activeTheme.get(),
      this.applyTheme,
      {
        fireImmediately: true,
      },
    );
  }

  protected applyTheme = ({ colors, type }: Theme) => {
    try {
      for (const [name, value] of Object.entries(colors)) {
        document.documentElement.style.setProperty(`--${name}`, value);
      }

      // Adding universal theme flag which can be used in component styles
      document.body.classList.toggle("theme-light", type === "light");
    } catch (error) {
      this.dependencies.logger.error(`Failed to apply theme change`, error);
      this.dependencies.resetTheme();
    }
  };
}
