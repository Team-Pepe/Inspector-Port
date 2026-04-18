/**
 * Network Service
 * Abstraction layer for Tauri IPC calls to network module
 */

import { invoke } from "@tauri-apps/api/core";
import type { PortInfo } from "../types/network";

export class NetworkService {
  /**
   * Fetch all active network ports from the system
   */
  static async getActivePorts(): Promise<PortInfo[]> {
    try {
      console.log("📡 Calling Tauri command: get_active_ports");
      const ports = await invoke<PortInfo[]>("get_active_ports");
      console.log("✅ Tauri response received:", ports?.length || 0, "ports");
      return ports || [];
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("❌ NetworkService error:", message);
      console.error("Full error object:", error);
      throw new Error(`Failed to fetch ports: ${message}`);
    }
  }
}
