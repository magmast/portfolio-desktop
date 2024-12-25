"use client";

import { Slot } from "@radix-ui/react-slot";
import { m } from "motion/react";
import React from "react";

import { MotionText } from "~/components/text";
import { cn } from "~/lib/utils";
import { scaleVariants } from "~/lib/variants";

const MotionSlot = m.create(Slot);

export function Desktop({
  className,
  transition,
  ...props
}: React.ComponentPropsWithRef<typeof m.div>) {
  return (
    <m.div
      {...props}
      className={cn(
        "relative flex flex-col flex-wrap items-start gap-4 overflow-hidden p-6",
        className,
      )}
      variants={{ hidden: {}, visible: {} }}
      transition={{
        staggerChildren: 0.2,
        ...transition,
      }}
    />
  );
}

export function DesktopItem({
  className,
  variants,
  transition,
  asChild,
  ...props
}: React.ComponentPropsWithRef<typeof m.button> & { asChild?: boolean }) {
  const Comp = asChild ? MotionSlot : m.button;

  return (
    <Comp
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      {...props}
      className={cn("flex w-16 flex-col items-center gap-1", className)}
      variants={{
        ...scaleVariants,
        ...variants,
      }}
      transition={{
        delayChildren: 0.3,
        ...transition,
      }}
    />
  );
}

export function DesktopIcon({
  className,
  children,
  ...props
}: Omit<React.ComponentPropsWithRef<"div">, "children"> & {
  children: ({ size }: { size: number }) => React.ReactNode;
}) {
  return (
    <div
      {...props}
      className={cn(
        "flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-xl bg-zinc-100",
        className,
      )}
    >
      {children({ size: 36 })}
    </div>
  );
}

export function DesktopLabel({
  className,
  variants,
  ...props
}: React.ComponentPropsWithoutRef<typeof MotionText> & {
  ref?: React.Ref<HTMLSpanElement>;
}) {
  return (
    <MotionText
      {...props}
      className={cn("text-white drop-shadow", className)}
      variants={{
        hidden: {
          opacity: 0,
          y: "-20%",
        },
        visible: {
          opacity: 1,
          y: 0,
        },
        ...variants,
      }}
    />
  );
}
