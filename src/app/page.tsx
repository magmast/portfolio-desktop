import * as m from "motion/react-m";
import React from "react";

import { CookiesApp } from "~/components/apps/cookies-app";
import { InfoApp } from "~/components/apps/info-app";
import { LicensesApp } from "~/components/apps/licenses-app";
import { SettingsApp } from "~/components/apps/settings-app";
import { MotionClock } from "~/components/clock";
import { Desktop } from "~/components/desktop";
import { PopoverCalendar } from "~/components/popover-calendar";
import { WindowBoundary } from "~/components/window";
import { scaleVariants } from "~/lib/variants";
import { Wallpaper } from "~/modules/wallpaper/server";

export default async function HomePage() {
  return (
    <m.main
      className="relative flex h-screen w-screen flex-col"
      initial="hidden"
      animate="visible"
    >
      <Wallpaper>
        <m.div
          className="relative flex w-full justify-center bg-black py-1 text-white"
          variants={{ hidden: { y: "-100%" }, visible: { y: 0 } }}
          transition={{ bounce: 0.2, when: "beforeChildren" }}
        >
          <PopoverCalendar>
            <MotionClock variants={scaleVariants} />
          </PopoverCalendar>
        </m.div>

        <React.Suspense>
          <WindowBoundary asChild>
            <Desktop className="flex-grow space-y-2">
              <InfoApp />
              <LicensesApp />
              <SettingsApp />
              <CookiesApp />
            </Desktop>
          </WindowBoundary>
        </React.Suspense>
      </Wallpaper>
    </m.main>
  );
}
