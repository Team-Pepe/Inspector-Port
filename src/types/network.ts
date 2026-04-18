/**
 * Network Port Types
 * Shared types between Tauri frontend and Rust backend
 */

export type PortState = 
  | "LISTENING"
  | "ESTABLISHED"
  | "TIME_WAIT"
  | "CLOSE_WAIT"
  | "SYN_SENT"
  | "SYN_RECV"
  | "FIN_WAIT1"
  | "FIN_WAIT2"
  | "CLOSING"
  | "LAST_ACK";

export type Protocol = "TCP" | "UDP";

export interface PortInfo {
  port: number;
  protocol: Protocol;
  localAddress: string;
  remoteAddress: string;
  processName: string;
  pid: number;
  state: PortState;
}

export interface NetworkStats {
  activeConnections: number;
  listeningPorts: number;
  establishedConnections: number;
  totalPorts: number;
}

export interface NetworkFilter {
  protocol: "all" | Protocol;
  state: "all" | PortState;
  searchTerm: string;
}
