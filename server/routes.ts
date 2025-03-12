import type { Express } from "express";
import { createServer, type Server } from "http";
import { handleProxy, serveProxy } from "./proxy";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy endpoints
  app.post("/api/proxy", handleProxy);
  app.get("/api/proxy/serve", serveProxy);

  const httpServer = createServer(app);
  return httpServer;
}
