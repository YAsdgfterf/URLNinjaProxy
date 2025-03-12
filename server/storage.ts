import { proxyRequests, type ProxyRequest, type InsertProxyRequest } from "@shared/schema";

export interface IStorage {
  createProxyRequest(request: InsertProxyRequest & { timestamp: string }): Promise<ProxyRequest>;
}

export class MemStorage implements IStorage {
  private requests: Map<number, ProxyRequest>;
  currentId: number;

  constructor() {
    this.requests = new Map();
    this.currentId = 1;
  }

  async createProxyRequest(request: InsertProxyRequest & { timestamp: string }): Promise<ProxyRequest> {
    const id = this.currentId++;
    const proxyRequest: ProxyRequest = { ...request, id };
    this.requests.set(id, proxyRequest);
    return proxyRequest;
  }
}

export const storage = new MemStorage();
