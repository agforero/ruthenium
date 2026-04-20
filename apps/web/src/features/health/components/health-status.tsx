import { useEffect, useState } from "react";
import { getHealth } from "../api/get-health";

export function HealthStatus() {
  const [label, setLabel] = useState("Loading…");

  useEffect(() => {
    let cancelled = false;
    getHealth()
      .then((h) => {
        if (!cancelled) {
          setLabel(`${h.service} @ ${h.time}`);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLabel(err instanceof Error ? err.message : "Request failed");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <p>API: {label}</p>;
}
