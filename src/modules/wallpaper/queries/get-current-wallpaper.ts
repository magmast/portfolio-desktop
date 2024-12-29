import { cookies } from "~/lib/cookies";

export async function getCurrentWallpaper() {
  const store = await cookies();
  return store.get("wallpaper") ?? "aiGenerated";
}
