/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { Injectable, InjectionToken } from "@ogre-tools/injectable";
import { getLegacyGlobalDiForExtensionApi } from "./legacy-global-di-for-extension-api";

type TentativeTuple<T> = T extends object ? [T] : [undefined?];

export function asLegacyGlobalObjectForExtensionApi<
  TInjectable extends Injectable<unknown, unknown, TInstantiationParameter>,
  TInstantiationParameter,
>(
  injectableKey: TInjectable,
  ...instantiationParameter: TentativeTuple<TInstantiationParameter>
): ReturnType<TInjectable["instantiate"]>;
export function asLegacyGlobalObjectForExtensionApi<TInjectionToken extends InjectionToken<unknown, unknown>>(
      injectionToken: TInjectionToken,
      ...instantiationParameter: TentativeTuple<
        TInjectionToken["instantiationParameter"]
      >
    ): TInjectionToken["template"];

export function asLegacyGlobalObjectForExtensionApi<
  TInjectable extends Injectable<unknown, unknown, TInstantiationParameter>,
  TInstantiationParameter,
>(
  injectableKey: TInjectable,
  ...instantiationParameter: TentativeTuple<TInstantiationParameter>
): ReturnType<TInjectable["instantiate"]> {
  return new Proxy(
    {},
    {
      get(target, propertyName) {
        if (propertyName === "$$typeof") {
          return undefined;
        }

        const instance: any = getLegacyGlobalDiForExtensionApi().inject(
          injectableKey,
          ...instantiationParameter,
        );

        const propertyValue = instance[propertyName];

        if (typeof propertyValue === "function") {
          return function (...args: any[]) {
            return propertyValue.apply(instance, args);
          };
        }

        return propertyValue;
      },
    },
  ) as ReturnType<TInjectable["instantiate"]>;
}
