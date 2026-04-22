import type { HealthResponse } from "@ruthenium/shared";
import { createPingPayload } from "./repository.js";

export function getPingResponse(): HealthResponse {
  return createPingPayload();
}
