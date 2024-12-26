"use client";

import { Slot } from "@radix-ui/react-slot";
import React from "react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

import { Calendar } from "./ui/calendar";

export function PopoverCalendar({
  asChild,
  ...props
}: React.ComponentPropsWithRef<"button"> & {
  asChild?: boolean;
  href?: string;
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Comp {...props} />
      </PopoverTrigger>

      <PopoverContent className="w-fit p-0">
        <Calendar />
      </PopoverContent>
    </Popover>
  );
}
