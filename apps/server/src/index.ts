import cors from "cors";
import express from "express";
import { healthResponseSchema, projectGraphRequestSchema } from "@ruthenium/shared";
import { buildProjectGraph } from "./graph/build-project-graph.js";

/** Local-only API: loopback bind + CORS for the Vite dev server / Electron (no Origin or `null`). */
const PORT = Number(process.env.PORT ?? 3001);
const LISTEN_HOST = "127.0.0.1";

const app = express();

const viteDevOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.use(
  cors({
    origin(origin, callback) {
      if (origin === undefined) {
        callback(null, true);
        return;
      }
      if (origin === "null") {
        callback(null, true);
        return;
      }
      if (viteDevOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  const payload = {
    ok: true as const,
    service: "ruthenium-server",
    time: new Date().toISOString(),
  };
  res.json(healthResponseSchema.parse(payload));
});

app.post("/api/project-graph", (req, res) => {
  const parsed = projectGraphRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      rootPath: "",
      tsconfigPath: null,
      nodes: [],
      edges: [],
      errors: [{ message: parsed.error.message }],
    });
    return;
  }

  try {
    const graph = buildProjectGraph(parsed.data.rootPath);
    res.json(graph);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      rootPath: parsed.data.rootPath,
      tsconfigPath: null,
      nodes: [],
      edges: [],
      errors: [
        {
          message: err instanceof Error ? err.message : "Failed to build project graph",
        },
      ],
    });
  }
});

app.listen(PORT, LISTEN_HOST, () => {
  console.log(`Server listening on http://${LISTEN_HOST}:${PORT} (local only)`);
});
