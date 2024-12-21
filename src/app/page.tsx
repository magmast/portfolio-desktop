import Image from "next/image";

import wallpaper from "~/assets/wallpapers/abstract-painting.jpg";
import { InfoApp } from "~/components/apps/info-app";
import { LicensesApp } from "~/components/apps/licenses-app";
import { SettingsApp } from "~/components/apps/settings-app";
import { Clock } from "~/components/clock";
import { Desktop } from "~/components/desktop";

export default function HomePage() {
  return (
    <main className="relative flex h-screen w-screen flex-col">
      <Image
        src={wallpaper}
        alt="Orange Blue Moon"
        className="absolute left-0 top-0 h-full w-full object-cover"
      />

      <div className="relative flex w-full justify-center bg-black py-1 text-white">
        <Clock />
      </div>

      <Desktop className="flex-grow">
        <InfoApp />
        <LicensesApp />
        <SettingsApp />
      </Desktop>
    </main>
  );
}
