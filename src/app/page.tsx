import Image from "next/image";

import wallpaper from "~/assets/wallpapers/abstract-painting.jpg";
import { AboutMe } from "~/components/about-me";
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
        <AboutMe />
      </Desktop>
    </main>
  );
}
