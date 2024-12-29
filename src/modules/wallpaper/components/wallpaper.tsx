import React from "react";

import { getCurrentWallpaper } from "../queries/get-current-wallpaper";
import { ClientWallpaper } from "./client-wallpaper";

export async function Wallpaper({ children }: { children: React.ReactNode }) {
  const wallpaper = await getCurrentWallpaper();
  return <ClientWallpaper wallpaper={wallpaper}>{children}</ClientWallpaper>;
}
