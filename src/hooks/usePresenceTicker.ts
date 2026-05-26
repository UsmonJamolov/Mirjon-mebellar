"use client";

import { useEffect, useState } from "react";

export function usePresenceTicker(intervalMs = 5000) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
