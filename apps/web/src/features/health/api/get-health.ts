import { healthResponseSchema, type HealthResponse } from "@ruthenium/shared";

export async function getHealth(): Promise<HealthResponse> {
  if (typeof window.ruthenium?.ping !== "function") {
    throw new Error("Run inside Electron (npm run dev) for the local shell.");
  }
  const json: unknown = await window.ruthenium.ping();
  return healthResponseSchema.parse(json);
}
