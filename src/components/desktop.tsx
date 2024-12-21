"use client";

import React from "react";

import { cn } from "~/lib/utils";

const DesktopContext = React.createContext<React.RefObject<HTMLDivElement>>({
  current: null,
});

export function useDesktop() {
  return React.use(DesktopContext);
}

export function Desktop({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <DesktopContext.Provider value={ref}>
      <div
        ref={ref}
        className={cn("relative overflow-hidden p-6", className)}
        {...props}
      />
    </DesktopContext.Provider>
  );
}
