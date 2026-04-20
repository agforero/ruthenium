import cors from "cors";
import express from "express";
import { healthResponseSchema } from "@ruthenium/shared";

const PORT = Number(process.env.PORT ?? 3001);

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  const payload = {
    ok: true as const,
    service: "ruthenium-server",
    time: new Date().toISOString(),
  };
  res.json(healthResponseSchema.parse(payload));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
