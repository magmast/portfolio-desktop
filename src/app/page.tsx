import React from "react";

import defaultWallpaper from "~/assets/wallpapers/abstract-painting.jpg";
import { InfoApp } from "~/components/apps/info-app";
import { LicensesApp } from "~/components/apps/licenses-app";
import { SettingsApp } from "~/components/apps/settings-app";
import { Clock } from "~/components/clock";
import { Desktop } from "~/components/desktop";
import { Wallpaper } from "~/components/wallpaper";
import { WindowManager } from "~/components/window";

export default function HomePage() {
  return (
    <main className="relative flex h-screen w-screen flex-col">
      <Wallpaper defaultWallpaper={defaultWallpaper}>
        <div className="relative flex w-full justify-center bg-black py-1 text-white">
          <Clock />
        </div>

        <Desktop className="flex-grow">
          <WindowManager className="h-full w-full space-y-3">
            <InfoApp />
            <LicensesApp />
            <SettingsApp />
          </WindowManager>
        </Desktop>
      </Wallpaper>
    </main>
  );
}
