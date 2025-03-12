import { type Request, type Response } from "express";
import { insertProxyRequestSchema } from "@shared/schema";
import { storage } from "./storage";

export async function handleProxy(req: Request, res: Response) {
  try {
    const validatedData = insertProxyRequestSchema.parse(req.body);

    // Store the proxy request
    await storage.createProxyRequest({
      url: validatedData.url,
      timestamp: new Date().toISOString()
    });

    // Return the proxied URL format
    res.json({
      proxyUrl: `/api/proxy/serve?url=${encodeURIComponent(validatedData.url)}`
    });
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : "Invalid request" 
    });
  }
}

export async function serveProxy(req: Request, res: Response) {
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ message: "URL parameter is required" });
  }

  try {
    // Validate URL
    new URL(url);

    // Forward the request through the proxy
    const response = await fetch(url);
    const contentType = response.headers.get("content-type") || "text/plain";

    // Set response headers
    res.setHeader("Content-Type", contentType);

    // Stream the response using async iteration
    if (!response.body) {
      throw new Error("No response body received");
    }

    const reader = response.body.getReader();
    res.on('close', () => reader.cancel());

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (error) {
      console.error("Error streaming response:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error streaming response" });
      }
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Invalid URL" 
      });
    }
  }
}