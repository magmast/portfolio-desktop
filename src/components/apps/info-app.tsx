"use client";

import { Info } from "lucide-react";

import { DesktopIcon } from "~/components/desktop";
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
    <Window>
      <WindowTrigger asChild>
        <DesktopIcon Icon={Info} label="Info" />
      </WindowTrigger>

      <WindowContent id="about-me">
        <WindowHeader>
          <WindowTitle>About Me</WindowTitle>
        </WindowHeader>

        <WindowBody>
          <p>
            I{"'"}m a software engineer with a passion for creating
            user-friendly and efficient web applications.
          </p>
        </WindowBody>
      </WindowContent>
    </Window>
  );
}
