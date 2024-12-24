"use client";

import { format } from "date-fns";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import React from "react";
import { useIsClient } from "usehooks-ts";

import { useDate } from "~/hooks/use-date";
import { cn } from "~/lib/utils";

import { Text } from "./text";

export function Clock({
  className,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof Text>, "children" | "asChild">) {
  const date = useDate();
  const isClient = useIsClient();

  return (
    <Text
      variant="clock"
      {...props}
      className={cn(
        "overflow-hidden text-sm font-semibold text-white",
        className,
      )}
      asChild
    >
      <p>
        <AnimatePresence mode="popLayout">
          {format(date, "d MMM HH:mm")
            .split("")
            .map((char, index) => (
              <m.span
                key={`${index}-${char}`}
                className={cn({ "inline-block": char !== " " })}
                initial={isClient ? { y: "-50%", scale: 0 } : false}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: "50%", scale: 0 }}
                transition={{ duration: 0.9 }}
              >
                {char}
              </m.span>
            ))}
        </AnimatePresence>
      </p>
    </Text>
  );
}

export const MotionClock = m.create(Clock);
