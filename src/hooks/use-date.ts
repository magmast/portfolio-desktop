import React, { useEffect } from "react";

export function useDate({ precisionMs = 1000 }: { precisionMs?: number } = {}) {
  const [date, setDate] = React.useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), precisionMs);
    return () => clearInterval(interval);
  }, [precisionMs]);

  return date;
}
