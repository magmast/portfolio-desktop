import { getCurrentWallpaper } from "~/modules/wallpaper/server";

import { ClientSettingsApp } from "./client";

export async function SettingsApp() {
  const wallpaper = await getCurrentWallpaper();
  return <ClientSettingsApp wallpaper={wallpaper} />;
}
