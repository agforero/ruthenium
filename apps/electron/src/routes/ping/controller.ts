import type { HealthResponse } from "@ruthenium/shared";
import { getPingResponse } from "./service.js";

export function pingController(): HealthResponse {
  return getPingResponse();
}
