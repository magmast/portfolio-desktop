import { Info } from "lucide-react";
import * as motion from "motion/react-client";

import {
  Window,
  WindowBody,
  WindowContent,
  WindowHeader,
  WindowTitle,
  WindowTrigger,
} from "~/components/window";

export function AboutMe() {
  return (
    <Window>
      <WindowTrigger asChild>
        <motion.button
          className="flex flex-col items-center gap-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-black">
            <Info size={36} />
          </div>

          <span className="text-sm text-white">About Me</span>
        </motion.button>
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
