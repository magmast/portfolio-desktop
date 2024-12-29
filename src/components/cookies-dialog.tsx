"use client";

import "vanilla-cookieconsent/dist/cookieconsent.css";

import { useEffect } from "react";
import { useIsClient } from "usehooks-ts";

import { showDialog } from "~/lib/cookie-consent";

export function CookiesDialog() {
  const isClient = useIsClient();
  useEffect(() => {
    if (isClient) {
      showDialog().catch(console.error);
    }
  }, [isClient]);
  return null;
}
