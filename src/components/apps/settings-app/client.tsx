"use client";

import { Info, Settings, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import React from "react";

import { DesktopIcon, DesktopItem, DesktopLabel } from "~/components/desktop";
import { Markdown } from "~/components/markdown";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Window,
  WindowBody,
  WindowContent,
  WindowHeader,
  WindowTitle,
  WindowTrigger,
} from "~/components/window";
import { cn } from "~/lib/utils";
import { scaleVariants } from "~/lib/variants";
import {
  setWallpaper,
  wallpapers,
  type WallpaperKey,
} from "~/modules/wallpaper";

const sizes =
  "(min-width: 640px) 236px, (min-width: 1024px) 364px, calc(50vw - 1.25rem)";

export function ClientSettingsApp({ wallpaper }: { wallpaper: WallpaperKey }) {
  return (
    <Window id="settings">
      <DesktopItem asChild>
        <WindowTrigger>
          <DesktopIcon>{({ size }) => <Settings size={size} />}</DesktopIcon>
          <DesktopLabel>Settings</DesktopLabel>
        </WindowTrigger>
      </DesktopItem>

      <WindowContent className="h-full w-full sm:h-auto sm:w-[512px] lg:w-[768px]">
        <WindowHeader>
          <WindowTitle>Settings</WindowTitle>
        </WindowHeader>

        <WindowBody>
          <h3 className="mb-2">Wallpaper</h3>

          <ScrollArea className="h-96">
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(wallpapers).map((key) => (
                <WallpaperButton
                  key={key}
                  wallpaper={key as WallpaperKey}
                  isActive={wallpaper === key}
                />
              ))}
            </div>
          </ScrollArea>
        </WindowBody>
      </WindowContent>
    </Window>
  );
}

function WallpaperButton({
  wallpaper,
  isActive,
}: {
  wallpaper: WallpaperKey;
  isActive: boolean;
}) {
  const [isInfoOpen, setInfoOpen] = React.useState(false);

  const wp = wallpapers[wallpaper];

  return (
    <div
      className={cn("relative overflow-hidden transition-[outline]", {
        "outline outline-blue-400": isActive,
      })}
    >
      <button onClick={() => setWallpaper(wallpaper)} className="block">
        <Image src={wp.src} alt={wp.alt} sizes={sizes} placeholder="blur" />
      </button>

      <AnimatePresence>
        {isInfoOpen && (
          <m.div
            className="prose absolute bottom-0 left-0 min-h-20 w-full max-w-full rounded-t-lg bg-white p-2 text-sm text-zinc-700"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ bounce: 0 }}
          >
            <Markdown>{wp.description}</Markdown>
          </m.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className="absolute bottom-2 right-2"
        onClick={() => setInfoOpen(!isInfoOpen)}
      >
        <AnimatePresence mode="popLayout">
          <m.span
            key={isInfoOpen ? "close" : "open"}
            variants={scaleVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {isInfoOpen ? <X /> : <Info />}
          </m.span>
        </AnimatePresence>
      </Button>
    </div>
  );
}
