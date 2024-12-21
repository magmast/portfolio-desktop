"use client";

import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useIsClient } from "usehooks-ts";

import { useDate } from "~/hooks/use-date";
import { cn } from "~/lib/utils";

export function Clock({
  className,
}: Omit<React.ComponentPropsWithRef<"p">, "children">) {
  const date = useDate();
  const isClient = useIsClient();

  return (
    <p
      className={cn(
        "overflow-hidden text-sm font-semibold text-white",
        className,
      )}
    >
      <AnimatePresence mode="popLayout">
        {format(date, "d MMM HH:mm")
          .split("")
          .map((char, index) => (
            <motion.span
              key={`${index}-${char}`}
              className={cn({ "inline-block": char !== " " })}
              initial={isClient ? { y: "-50%", scale: 0 } : false}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: "50%", scale: 0 }}
              transition={{ duration: 0.9 }}
            >
              {char}
            </motion.span>
          ))}
      </AnimatePresence>
    </p>
  );
}
