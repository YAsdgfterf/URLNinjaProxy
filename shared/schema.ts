import { pgTable, text, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const proxyRequests = pgTable("proxy_requests", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 2048 }).notNull(),
  timestamp: text("timestamp").notNull()
});

export const insertProxyRequestSchema = createInsertSchema(proxyRequests).pick({
  url: true
}).extend({
  url: z.string().url("Please enter a valid URL").min(1, "URL is required")
});

export type InsertProxyRequest = z.infer<typeof insertProxyRequestSchema>;
export type ProxyRequest = typeof proxyRequests.$inferSelect;
