"use client";

import { Info } from "lucide-react";

import { DesktopIcon, DesktopItem, DesktopLabel } from "~/components/desktop";
import { Text } from "~/components/text";
import {
  Window,
  WindowBody,
  WindowContent,
  WindowHeader,
  WindowTitle,
  WindowTrigger,
} from "~/components/window";

export function InfoApp() {
  return (
    <Window id="about-me">
      <DesktopItem asChild>
        <WindowTrigger>
          <DesktopIcon>{({ size }) => <Info size={size} />}</DesktopIcon>
          <DesktopLabel>Info</DesktopLabel>
        </WindowTrigger>
      </DesktopItem>

      <WindowContent>
        <WindowHeader>
          <WindowTitle>About Me</WindowTitle>
        </WindowHeader>

        <WindowBody>
          <Text variant="body" asChild>
            <p>
              I{"'"}m a software engineer with a passion for creating
              user-friendly and efficient web applications.
            </p>
          </Text>
        </WindowBody>
      </WindowContent>
    </Window>
  );
}
