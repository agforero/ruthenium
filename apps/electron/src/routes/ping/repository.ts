import { healthResponseSchema, type HealthResponse } from "@ruthenium/shared";

export function createPingPayload(): HealthResponse {
  return healthResponseSchema.parse({
    ok: true as const,
    service: "ruthenium-main",
    time: new Date().toISOString(),
  });
}
