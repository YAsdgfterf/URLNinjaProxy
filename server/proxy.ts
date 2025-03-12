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
    
    res.setHeader("Content-Type", contentType);
    response.body?.pipe(res);
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : "Invalid URL" 
    });
  }
}
