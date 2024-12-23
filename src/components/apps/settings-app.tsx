"use client";

import { Settings } from "lucide-react";
import Image from "next/image";

import abstractPainting from "~/assets/wallpapers/abstract-painting.jpg";
import orangeMoon from "~/assets/wallpapers/orange-moon.jpg";
import { DesktopIcon } from "~/components/desktop";
import { useWallpaper } from "~/components/wallpaper";
import {
  Window,
  WindowBody,
  WindowContent,
  WindowHeader,
  WindowTitle,
  WindowTrigger,
} from "~/components/window";

export function SettingsApp() {
  const wallpaper = useWallpaper();

  return (
    <Window id="settings">
      <WindowTrigger asChild>
        <DesktopIcon Icon={Settings} label="Settings" />
      </WindowTrigger>

      <WindowContent>
        <WindowHeader>
          <WindowTitle>Settings</WindowTitle>
        </WindowHeader>
        <WindowBody>
          <h3 className="mb-2">Wallpaper</h3>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => wallpaper?.setWallpaper(abstractPainting)}>
              <Image src={abstractPainting} alt="Abstract Painting" />
            </button>

            <button onClick={() => wallpaper?.setWallpaper(orangeMoon)}>
              <Image src={orangeMoon} alt="Orange Moon" />
            </button>
          </div>
        </WindowBody>
      </WindowContent>
    </Window>
  );
}
