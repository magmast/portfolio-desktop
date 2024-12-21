"use client";

import * as m from "motion/react-m";
import React from "react";

import { cn } from "~/lib/utils";

const DesktopContext = React.createContext<
  React.RefObject<HTMLDivElement | null>
>({
  current: null,
});

export function useDesktop() {
  return React.use(DesktopContext);
}

export function Desktop({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <DesktopContext.Provider value={ref}>
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col flex-wrap items-start gap-4 overflow-hidden p-6",
          className,
        )}
        {...props}
      />
    </DesktopContext.Provider>
  );
}

export function DesktopIcon({
  Icon,
  label,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof m.button> & {
  Icon: React.ElementType;
  label: string;
}) {
  return (
    <m.button
      {...props}
      className={cn("flex w-16 flex-col items-center gap-2", className)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-black">
        <Icon size={36} />
      </div>

      <span className="text-sm text-white">{label}</span>
    </m.button>
  );
}
