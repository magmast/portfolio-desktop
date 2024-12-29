"use server";

import { cookies } from "~/lib/cookies";

import type { WallpaperKey } from "../constants/wallpapers";

export async function setWallpaper(wallpaper: WallpaperKey) {
  const store = await cookies();
  store.set("wallpaper", wallpaper);
}
