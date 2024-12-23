import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { domMax, LazyMotion } from "motion/react";
import { type Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "Maciej Augustyniak",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <NuqsAdapter>
          <LazyMotion features={domMax} strict>
            {children}
          </LazyMotion>
        </NuqsAdapter>
      </body>
    </html>
  );
}
