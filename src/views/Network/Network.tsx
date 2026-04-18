/**
 * Network Ports View
 * Main view for inspecting and monitoring system ports
 */

import { onMount, onCleanup, Show } from "solid-js";
import { networkState, fetchPorts } from "./stores/networkStore";
import PortFilters from "./components/PortFilters";
import PortsTable from "./components/PortsTable";

export default function Network() {
  let refreshIntervalId: ReturnType<typeof setInterval> | null = null;

  onMount(async () => {
    try {
      console.log("🚀 Network component mounted");
      await fetchPorts();
      console.log("✅ Initial fetch complete");

      refreshIntervalId = setInterval(async () => {
        await fetchPorts();
      }, 5000);
    } catch (error) {
      console.error("❌ Mount error:", error);
    }
  });

  onCleanup(() => {
    if (refreshIntervalId) clearInterval(refreshIntervalId);
  });

  return (
    <div class="space-y-6 w-full">
      <div class="text-on-background">
        <h1 class="text-2xl font-bold mb-1">Network Ports</h1>
        <p class="text-secondary text-sm">Monitor active TCP/UDP ports</p>
      </div>

      {/* Show error if exists */}
      <Show when={networkState.error}>
        <div class="p-4 bg-error/10 border border-error rounded-lg">
          <p class="text-error font-bold">⚠️ Error: {networkState.error}</p>
        </div>
      </Show>

      {/* Metrics */}
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-surface-container border border-outline-variant rounded-lg p-4">
          <p class="text-secondary text-xs mb-1">Active Ports</p>
          <p class="text-2xl font-bold text-on-background">{networkState.ports.length}</p>
        </div>
        <div class="bg-surface-container border border-outline-variant rounded-lg p-4">
          <p class="text-secondary text-xs mb-1">TCP</p>
          <p class="text-2xl font-bold text-primary">{networkState.ports.filter(p => p.protocol === "TCP").length}</p>
        </div>
        <div class="bg-surface-container border border-outline-variant rounded-lg p-4">
          <p class="text-secondary text-xs mb-1">UDP</p>
          <p class="text-2xl font-bold text-secondary">{networkState.ports.filter(p => p.protocol === "UDP").length}</p>
        </div>
      </div>

      {/* Filters */}
      <div class="bg-surface-container border border-outline-variant rounded-lg p-4">
        <h3 class="font-bold text-on-background mb-3">Filters</h3>
        <PortFilters />
      </div>

      {/* Table */}
      <div class="bg-surface-container border border-outline-variant rounded-lg p-4">
        <h3 class="font-bold text-on-background mb-3">Ports ({networkState.filteredPorts.length})</h3>
        <PortsTable ports={networkState.filteredPorts} loading={networkState.loading} />
      </div>
    </div>
  );
}