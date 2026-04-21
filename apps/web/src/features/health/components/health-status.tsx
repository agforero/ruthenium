import { useEffect, useState } from "react";
import { getHealth } from "../api/get-health";

export function HealthStatus() {
  const [label, setLabel] = useState("Loading…");

  useEffect(() => {
    const state = { cancelled: false };
    getHealth()
      .then((h) => {
        if (!state.cancelled) {
          setLabel(`${h.service} @ ${h.time}`);
        }
      })
      .catch((err: unknown) => {
        if (!state.cancelled) {
          setLabel(err instanceof Error ? err.message : "Request failed");
        }
      });
    return () => {
      state.cancelled = true;
    };
  }, []);

  return <p>Main process: {label}</p>;
}
