"use client";

import { Copyright } from "lucide-react";

import { DesktopIcon, DesktopItem, DesktopLabel } from "~/components/desktop";
import { ToDoWindow, WindowTrigger } from "~/components/window";

export function LicensesApp() {
  return (
    <ToDoWindow id="licenses" title="Licenses">
      <DesktopItem asChild>
        <WindowTrigger>
          <DesktopIcon>{({ size }) => <Copyright size={size} />}</DesktopIcon>
          <DesktopLabel>Licenses</DesktopLabel>
        </WindowTrigger>
      </DesktopItem>
    </ToDoWindow>
  );
}
