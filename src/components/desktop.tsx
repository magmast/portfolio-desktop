"use client";

import * as m from "motion/react-m";
import React from "react";

import { Text } from "~/components/text";
import { cn } from "~/lib/utils";

export function Desktop({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) {
  return (
    <div
      className={cn(
        "relative flex flex-col flex-wrap items-start gap-4 overflow-hidden p-6",
        className,
      )}
      {...props}
    />
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
      className={cn("flex w-16 flex-col items-center gap-1", className)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-black">
        <Icon size={36} />
      </div>

      <Text variant="icon-label" className="text-white drop-shadow">
        {label}
      </Text>
    </m.button>
  );
}
