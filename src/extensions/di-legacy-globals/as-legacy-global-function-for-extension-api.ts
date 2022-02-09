/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { InferFromInjectable, Injectable, InjectionToken, TentativeTuple } from "@ogre-tools/injectable";
import { getLegacyGlobalDiForExtensionApi } from "./legacy-global-di-for-extension-api";

export function asLegacyGlobalFunctionForExtensionApi<
  TInjectionToken extends InjectionToken<unknown, unknown>,
>(
  injectionToken: TInjectionToken,
  ...instantiationParameter: TentativeTuple<TInjectionToken["instantiationParameter"]>
): TInjectionToken["template"];

export function asLegacyGlobalFunctionForExtensionApi<
  TInjectable extends Injectable<unknown, (...args: any[]) => any, unknown>,
>(
  injectableKey: TInjectable,
  ...instantiationParameter: TentativeTuple<InferFromInjectable<TInjectable>[1]>
): InferFromInjectable<TInjectable>[1] {
  return (...args: Parameters<InferFromInjectable<TInjectable>[0]>) => {
    const injected = getLegacyGlobalDiForExtensionApi()
      .inject(
        injectableKey,
        ...instantiationParameter,
      );

    return injected(...args);
  };
}
