import { cookies as nextCookies } from "next/headers";
import { z } from "zod";

import { wallpaperKeys } from "~/modules/wallpaper";

export const cookieMap = {
  consent: {
    type: "json",
    schema: z.object({
      categories: z.array(z.enum(["necessary", "preferences"])),
    }),
    category: "necessary",
  },
  wallpaper: {
    type: "string",
    schema: z.enum(wallpaperKeys),
    category: "preferences",
  },
} as const;

export type CookieKey = keyof typeof cookieMap;

export type CookieCategory = (typeof cookieMap)[CookieKey]["category"];

type InferCookie<T extends CookieKey> = (typeof cookieMap)[T];

type InferCookieCategory<T extends CookieKey> = InferCookie<T>["category"];

type InferCookieSchema<T extends CookieKey> = InferCookie<T>["schema"];

type InferCookieType<T extends CookieKey> = InferCookie<T>["type"];

export type InferCookieValue<T extends CookieKey> = z.infer<
  InferCookieSchema<T>
>;

function getCookie<T extends CookieKey>(key: T): InferCookie<T> {
  return cookieMap[key];
}

export function getCookieCategory<T extends CookieKey>(
  key: T,
): InferCookieCategory<T> {
  return getCookie(key).category;
}

function getCookieType<T extends CookieKey>(key: T): InferCookieType<T> {
  return getCookie(key).type;
}

export function stringifyCookie<T extends CookieKey>(
  key: T,
  value: InferCookieValue<T>,
) {
  const type = getCookieType(key);
  switch (type) {
    case "string":
      return value as string;

    case "json":
      return JSON.stringify(value);

    default:
      throw new Error("All cookie types must be covered");
  }
}

export function parseCookie<T extends CookieKey>(
  key: T,
  value: string,
): InferCookieValue<T> {
  const cookie = getCookie(key);
  if (cookie.type === "string") {
    return cookie.schema.parse(value);
  }
  return cookie.schema.parse(JSON.parse(value));
}

export async function cookies() {
  const store = await nextCookies();
  return {
    get: <T extends CookieKey>(key: T) => {
      const value = store.get(key)?.value;
      if (value === undefined) {
        return undefined;
      }
      return parseCookie(key, value);
    },
    set: <T extends CookieKey>(key: T, value: InferCookieValue<T>) => {
      store.set(key, stringifyCookie(key, value));
    },
  };
}
