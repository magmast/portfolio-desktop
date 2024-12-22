import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { domMax, LazyMotion } from "motion/react";
import { type Metadata } from "next";

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
        <LazyMotion features={domMax} strict>
          {children}
        </LazyMotion>
      </body>
    </html>
  );
}
