import { useSearchParams } from "next/navigation";
import {
  createSerializer,
  type inferParserType,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsString,
} from "nuqs";
import React from "react";

export const searchParams = {
  windows: parseAsArrayOf(parseAsString).withDefault([]),
  isMaximized: parseAsBoolean.withDefault(false),
};

export const urlKeys = {
  windows: "w",
  isMaximized: "m",
};

export const serialize = createSerializer(searchParams, { urlKeys });

export function useSerialize() {
  const baseParams = useSearchParams();
  return React.useCallback(
    (params: Partial<inferParserType<typeof searchParams>>) => {
      const href = serialize(baseParams, params);
      return href === "" ? "?" : href;
    },
    [baseParams],
  );
}
