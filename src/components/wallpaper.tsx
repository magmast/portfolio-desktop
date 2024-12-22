"use client";

import { AnimatePresence, m } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import React from "react";
import { useIsClient } from "usehooks-ts";

const MotionImage = m.create(Image);

interface WallpaperState {
  wallpaper: StaticImageData;
  setWallpaper: (wallpaper: StaticImageData) => void;
}

const WallpaperContext = React.createContext<WallpaperState | undefined>(
  undefined,
);

export function useWallpaper() {
  return React.use(WallpaperContext);
}

export function Wallpaper({
  defaultWallpaper,
  children,
}: {
  defaultWallpaper: StaticImageData;
  children: React.ReactNode;
}) {
  const isClient = useIsClient();

  const [wallpaper, setWallpaper] = React.useState(defaultWallpaper);

  return (
    <WallpaperContext.Provider value={{ wallpaper, setWallpaper }}>
      <AnimatePresence mode="popLayout">
        <MotionImage
          key={wallpaper.src}
          src={wallpaper}
          alt="Wallpaper"
          className="absolute left-0 top-0 h-full w-full object-cover"
          sizes="100vw"
          placeholder="blur"
          initial={isClient ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          priority
        />
      </AnimatePresence>

      {children}
    </WallpaperContext.Provider>
  );
}
