import { z } from "zod";

export const healthResponseSchema = z.object({
  ok: z.literal(true),
  service: z.string(),
  time: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const projectGraphRequestSchema = z.object({
  rootPath: z.string().min(1),
});

export type ProjectGraphRequest = z.infer<typeof projectGraphRequestSchema>;

export const graphEdgeSchema = z.object({
  from: z.string(),
  to: z.string().nullable(),
  specifier: z.string(),
  kind: z.enum(["static", "dynamic", "require"]),
  typeOnly: z.boolean().optional(),
  external: z.boolean().optional(),
});

export const projectGraphSchema = z.object({
  rootPath: z.string(),
  tsconfigPath: z.string().nullable(),
  nodes: z.array(z.object({ path: z.string() })),
  edges: z.array(graphEdgeSchema),
  errors: z.array(
    z.object({
      message: z.string(),
      file: z.string().optional(),
    }),
  ),
});

export type ProjectGraph = z.infer<typeof projectGraphSchema>;
export type GraphEdge = z.infer<typeof graphEdgeSchema>;
