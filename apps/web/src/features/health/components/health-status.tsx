import { useQuery } from "@tanstack/react-query";
import { getHealth } from "../api/get-health";

export function HealthStatus() {
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 30_000,
  });

  if (healthQuery.isPending) {
    return <p>Main process: checking IPC…</p>;
  }

  if (healthQuery.error) {
    return (
      <p>
        Main process:{" "}
        {healthQuery.error instanceof Error
          ? healthQuery.error.message
          : "Request failed"}
      </p>
    );
  }

  return (
    <p>
      Main process: {healthQuery.data.service} @ {healthQuery.data.time}
    </p>
  );
}
