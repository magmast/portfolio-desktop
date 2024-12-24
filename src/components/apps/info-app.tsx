"use client";

import { Info } from "lucide-react";

import { DesktopIcon } from "~/components/desktop";
import { Text } from "~/components/text";
import {
  Window,
  WindowBody,
  WindowContent,
  WindowHeader,
  WindowTitle,
  WindowTrigger,
} from "~/components/window";

export function InfoApp({ enterDelay = 0 }: { enterDelay?: number }) {
  return (
    <Window id="about-me">
      <WindowTrigger asChild>
        <DesktopIcon
          Icon={Info}
          label="Info"
          transition={{ delay: enterDelay }}
        />
      </WindowTrigger>

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
