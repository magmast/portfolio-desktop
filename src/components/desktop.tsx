"use client";

import * as m from "motion/react-m";
import React from "react";

import { MotionText } from "~/components/text";
import { cn } from "~/lib/utils";
import { scaleVariants } from "~/variants/scale-variants";

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
  transition,
  ...props
}: React.ComponentPropsWithRef<typeof m.button> & {
  Icon: React.ElementType;
  label: string;
}) {
  return (
    <m.button
      variants={{
        ...scaleVariants,
        hover: { scale: 1.1 },
        tap: { scale: 0.9 },
      }}
      {...props}
      className={cn("flex w-16 flex-col items-center gap-1", className)}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      transition={{
        when: "beforeChildren",
        ...transition,
      }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-black">
        <Icon size={36} />
      </div>

      <MotionText
        variant="icon-label"
        className="text-white drop-shadow"
        variants={{
          hidden: { y: "-1rem", opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
      >
        {label}
      </MotionText>
    </m.button>
  );
}
