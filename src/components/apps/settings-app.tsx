"use client";

import { Settings } from "lucide-react";

import { DesktopIcon } from "../desktop";
import { ToDoWindow, WindowTrigger } from "../window";

export function SettingsApp() {
  return (
    <ToDoWindow id="settings" title="Settings">
      <WindowTrigger asChild>
        <DesktopIcon Icon={Settings} label="Settings" />
      </WindowTrigger>
    </ToDoWindow>
  );
}
