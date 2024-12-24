"use client";

import { Copyright } from "lucide-react";

import { DesktopIcon } from "../desktop";
import { ToDoWindow, WindowTrigger } from "../window";

export function LicensesApp({ enterDelay = 0 }: { enterDelay?: number }) {
  return (
    <ToDoWindow id="licenses" title="Licenses">
      <WindowTrigger asChild>
        <DesktopIcon
          Icon={Copyright}
          label="Licenses"
          transition={{ delay: enterDelay }}
        />
      </WindowTrigger>
    </ToDoWindow>
  );
}
