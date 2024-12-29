"use client";

import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import React from "react";
import { useIsClient } from "usehooks-ts";

import { type WallpaperKey, wallpapers } from "../constants/wallpapers";

const MotionImage = m.create(Image);

export function ClientWallpaper({
  wallpaper: wallpaperKey,
  children,
}: {
  wallpaper: WallpaperKey;
  children: React.ReactNode;
}) {
  const isClient = useIsClient();

  const wallpaper = wallpapers[wallpaperKey];

  return (
    <>
      <AnimatePresence mode="popLayout">
        <MotionImage
          key={wallpaperKey}
          src={wallpaper.src}
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
    </>
  );
}
