"use client";

import { Copyright } from "lucide-react";

import { DesktopIcon } from "../desktop";
import { ToDoWindow, WindowTrigger } from "../window";

export function LicensesApp() {
  return (
    <ToDoWindow id="licenses" title="Licenses">
      <WindowTrigger asChild>
        <DesktopIcon Icon={Copyright} label="Licenses" />
      </WindowTrigger>
    </ToDoWindow>
  );
}
