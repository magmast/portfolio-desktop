import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { domAnimation, LazyMotion } from "motion/react";
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
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </body>
    </html>
  );
}
