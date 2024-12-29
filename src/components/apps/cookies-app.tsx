"use client";

import { Cookie } from "lucide-react";

import { showPreferences } from "~/lib/cookie-consent";

import { DesktopIcon, DesktopItem, DesktopLabel } from "../desktop";

export function CookiesApp() {
  return (
    <DesktopItem onClick={showPreferences}>
      <DesktopIcon>{({ size }) => <Cookie size={size} />}</DesktopIcon>
      <DesktopLabel>Cookies</DesktopLabel>
    </DesktopItem>
  );
}
