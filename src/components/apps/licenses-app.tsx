"use client";

import { Copyright } from "lucide-react";

import { DesktopIcon, DesktopItem, DesktopLabel } from "../desktop";
import { ToDoWindow, WindowTrigger } from "../window";

export function LicensesApp() {
  return (
    <ToDoWindow id="licenses" title="Licenses">
      <WindowTrigger asChild>
        <DesktopItem>
          <DesktopIcon>{({ size }) => <Copyright size={size} />}</DesktopIcon>
          <DesktopLabel>Licenses</DesktopLabel>
        </DesktopItem>
      </WindowTrigger>
    </ToDoWindow>
  );
}
