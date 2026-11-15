import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import {
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./middleware.js";
import { middlewareErrorHandler } from "./middleware.js";
import "./db/migrate.js";
import { config } from "./config.js";
import { handlerCreateUser, handlerUpdateUser, } from "./api/users.js";
import { handlerCreateChirp, handlerDeleteChirp } from "./api/chirps.js";
import { handlerGetAllChirps, handlerGetChirp } from "./api/chirps.js";
import { handlerLogin } from "./api/login.js";
import { handlerRefresh } from "./api/refresh.js";
import { handlerRevoke } from "./api/revoke.js";
import { handlerPolkaWebhook } from "./api/polka.js";

const app = express();
const PORT = config.api.port;

app.use(express.json());

// Log non-OK responses
app.use(middlewareLogResponses);

// Readiness endpoint
app.get("/healthz", handlerReadiness);

// Admin endpoints
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

// Chirp validation endpoint
app.post("/api/chirps", handlerCreateChirp);

// Get all chirps endpoint
app.get("/api/chirps", handlerGetAllChirps);

// Get a specific chirp by ID endpoint
app.get("/api/chirps/:chirpId", handlerGetChirp);

// User creation endpoint
app.post("/api/users", handlerCreateUser);
// User update endpoint
app.put("/api/users", handlerUpdateUser);

// Static files and request counter
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

// Login endpoint
app.post("/api/login", handlerLogin);

// Refresh and revoke endpoints
app.post("/api/refresh", handlerRefresh);
app.post("/api/revoke", handlerRevoke);

// Delete chirp endpoint
app.delete("/api/chirps/:chirpId", handlerDeleteChirp);

// Polka webhook endpoint
app.post("/api/polka", handlerPolkaWebhook);

app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});