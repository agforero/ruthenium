import { healthResponseSchema, type HealthResponse } from "@ruthenium/shared";
import { apiUrl } from "@/lib/api-client";

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(apiUrl("/api/health"));
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }
  const json: unknown = await res.json();
  return healthResponseSchema.parse(json);
}
