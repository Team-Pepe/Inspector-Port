/**
 * Network Store
 * Manages network port data state using SolidJS stores
 */

import { createStore } from "solid-js/store";
import { createEffect } from "solid-js";
import type { PortInfo, NetworkFilter } from "../../../types/network";
import { NetworkService } from "../../../services/networkService";

export interface NetworkState {
  ports: PortInfo[];
  filteredPorts: PortInfo[];
  loading: boolean;
  error: string | null;
  lastUpdate: number | null;
  filters: NetworkFilter;
  autoRefreshInterval: number; // milliseconds
}

const INITIAL_STATE: NetworkState = {
  ports: [],
  filteredPorts: [],
  loading: false,
  error: null,
  lastUpdate: null,
  filters: {
    protocol: "all",
    state: "all",
    searchTerm: "",
  },
  autoRefreshInterval: 5000, // 5 seconds
};

const [networkState, setNetworkState] = createStore<NetworkState>(INITIAL_STATE);

/**
 * Apply filters to ports
 */
function applyFilters(ports: PortInfo[], filters: NetworkFilter): PortInfo[] {
  return ports.filter((port) => {
    // Protocol filter
    if (filters.protocol !== "all" && port.protocol !== filters.protocol) {
      return false;
    }

    // State filter
    if (filters.state !== "all" && port.state !== filters.state) {
      return false;
    }

    // Search term filter (checks process name)
    if (
      filters.searchTerm &&
      !port.processName
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Fetch ports from service and update state
 */
export const fetchPorts = async () => {
  setNetworkState("loading", true);
  setNetworkState("error", null);

  try {
    console.log("📥 fetchPorts: Starting fetch...");
    const ports = await NetworkService.getActivePorts();
    console.log("📥 fetchPorts: Received", ports.length, "total ports");

    // Only keep LISTENING ports
    const listeningPorts = ports.filter((p) => p.state === "LISTENING");
    console.log("📥 fetchPorts: Filtered to", listeningPorts.length, "LISTENING ports");

    setNetworkState("ports", listeningPorts);
    setNetworkState("lastUpdate", Date.now());
    setNetworkState("loading", false);

    // Apply filters to get filtered ports
    const filtered = applyFilters(
      listeningPorts,
      networkState.filters
    );
    console.log("📥 fetchPorts: Applied filters, result:", filtered.length, "ports");
    setNetworkState("filteredPorts", filtered);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ fetchPorts error:", message);
    setNetworkState("error", message);
    setNetworkState("loading", false);
  }
};

/**
 * Set protocol filter
 */
export const setProtocolFilter = (protocol: "all" | string) => {
  setNetworkState("filters", "protocol", protocol as "all" | "TCP" | "UDP");
  const filtered = applyFilters(networkState.ports, {
    ...networkState.filters,
    protocol: protocol as "all" | "TCP" | "UDP",
  });
  setNetworkState("filteredPorts", filtered);
};

/**
 * Set state filter
 */
export const setStateFilter = (state: "all" | string) => {
  setNetworkState("filters", "state", state as any);
  const filtered = applyFilters(networkState.ports, {
    ...networkState.filters,
    state: state as any,
  });
  setNetworkState("filteredPorts", filtered);
};

/**
 * Set search term
 */
export const setSearchTerm = (term: string) => {
  setNetworkState("filters", "searchTerm", term);
  const filtered = applyFilters(networkState.ports, {
    ...networkState.filters,
    searchTerm: term,
  });
  setNetworkState("filteredPorts", filtered);
};

/**
 * Clear all filters
 */
export const clearFilters = () => {
  setNetworkState("filters", INITIAL_STATE.filters);
  setNetworkState("filteredPorts", networkState.ports);
};

/**
 * Set auto-refresh interval
 */
export const setAutoRefreshInterval = (interval: number) => {
  setNetworkState("autoRefreshInterval", interval);
};

/**
 * Export store and actions
 */
export { networkState, setNetworkState };

export default {
  networkState,
  fetchPorts,
  setProtocolFilter,
  setStateFilter,
  setSearchTerm,
  clearFilters,
  setAutoRefreshInterval,
};
