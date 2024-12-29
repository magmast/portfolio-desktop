import { cookies } from "next/headers";
import type { z } from "zod";

export type CookieDefinition = {
  category: string;
  type: "string" | "json";
  schema?: z.ZodType;
};

type Definitions = Record<string, CookieDefinition>;

type InferCookieTypeFromDef<
  TDef extends Definitions,
  TKey extends keyof TDef,
> = TDef[TKey]["type"];

type InferCookieValueFromDef<
  TDef extends Definitions,
  TKey extends keyof TDef,
> = TDef[TKey]["schema"] extends z.ZodType
  ? z.infer<TDef[TKey]["schema"]>
  : InferCookieTypeFromDef<TDef, TKey> extends "string"
    ? string
    : unknown;

export type InferCookieKeys<TCookies> =
  TCookies extends Cookies<infer TDef> ? keyof TDef : never;

export type InferCookieCategories<TCookies> =
  TCookies extends Cookies<infer TDef>
    ? { [K in keyof TDef]: TDef[K]["category"] }[keyof TDef]
    : never;

export type InferCookieValue<TCookies, TKey extends InferCookieKeys<TCookies>> =
  TCookies extends Cookies<infer TDef>
    ? InferCookieValueFromDef<TDef, TKey>
    : never;

export type Cookies<TDef extends Definitions> = () => Promise<{
  _def: TDef;
  readonly size: number;
  has: <T extends keyof TDef>(key: T) => boolean;
  get: <T extends keyof TDef>(
    key: T,
  ) => InferCookieValueFromDef<TDef, T> | undefined;
  getAll: () => {
    [K in keyof TDef]: InferCookieValueFromDef<TDef, K> | undefined;
  };
  set: <T extends keyof TDef>(
    key: T,
    value: InferCookieValueFromDef<TDef, T>,
  ) => void;
  delete: <T extends keyof TDef>(key: T) => void;
  toString: () => string;
}>;

export function createCookies<TDef extends Definitions>(def: TDef) {
  return async () => {
    const store = await cookies();

    const get = <T extends keyof TDef>(
      key: T,
    ): InferCookieValueFromDef<TDef, T> | undefined => {
      const cookie = store.get(key as string);
      if (!cookie) {
        return undefined;
      }

      const { type, schema } = def[key]!;
      const value =
        type === "string"
          ? cookie.value
          : (JSON.parse(cookie.value) as unknown);
      if (!schema) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return value as InferCookieValueFromDef<TDef, T>;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return schema.parse(value);
    };

    return {
      _def: def,

      get size() {
        return store.size;
      },

      has: <T extends keyof TDef>(key: T) => store.has(key as string),

      get,

      getAll: () => {
        return Object.fromEntries(
          Object.keys(def).map((key) => [key, get(key)]),
        ) as {
          [K in keyof TDef]: InferCookieValueFromDef<TDef, K> | undefined;
        };
      },

      set: <T extends keyof TDef>(
        key: T,
        value: InferCookieValueFromDef<TDef, T>,
      ) => {
        const stringified =
          typeof value === "string" ? value : JSON.stringify(value);
        store.set(key as string, stringified);
      },

      delete: <T extends keyof TDef>(key: T) => {
        store.delete(key as string);
      },

      toString: () => store.toString(),
    } satisfies Awaited<ReturnType<Cookies<TDef>>>;
  };
}
