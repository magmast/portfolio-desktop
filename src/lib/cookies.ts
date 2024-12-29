import { z } from "zod";

import {
  createCookies,
  type InferCookieCategories,
  type InferCookieKeys,
} from "~/modules/cookies";
import { wallpaperKeys } from "~/modules/wallpaper";

export const cookies = createCookies({
  consent: {
    type: "json",
    category: "necessary",
    schema: z.object({
      categories: z.array(z.enum(["necessary", "preferences"])),
    }),
  },
  wallpaper: {
    type: "string",
    category: "preferences",
    schema: z.enum(wallpaperKeys),
  },
} as const);

export type CookieKey = InferCookieKeys<typeof cookies>;

export type CookieCategory = InferCookieCategories<typeof cookies>;
