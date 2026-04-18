/**
 * Port Filters Component
 * Provides filtering UI for protocol, state, and search
 */

import { createSignal, Show } from "solid-js";
import { networkState, setProtocolFilter, setStateFilter, setSearchTerm, clearFilters } from "../stores/networkStore";
import type { PortState } from "../../../types/network";

export default function PortFilters() {
  const [searchInput, setSearchInput] = createSignal("");

  const PORT_STATES: PortState[] = [
    "LISTENING",
    "ESTABLISHED",
    "TIME_WAIT",
    "CLOSE_WAIT",
    "SYN_SENT",
    "SYN_RECV",
    "FIN_WAIT1",
    "FIN_WAIT2",
    "CLOSING",
    "LAST_ACK",
  ];

  const handleProtocolChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    setProtocolFilter(target.value);
  };

  const handleStateChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    setStateFilter(target.value);
  };

  const handleSearchChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setSearchInput(target.value);
    setSearchTerm(target.value);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    clearFilters();
  };

  const isFiltered = () =>
    networkState.filters.protocol !== "all" ||
    networkState.filters.state !== "all" ||
    networkState.filters.searchTerm !== "";

  return (
    <div class="space-y-4">
      {/* Filters Grid */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Protocol Filter */}
        <div class="space-y-2">
          <label class="block text-sm font-medium text-secondary">
            Protocol
          </label>
          <select
            value={networkState.filters.protocol}
            onChange={handleProtocolChange}
            class="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-on-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          >
            <option value="all">All</option>
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
          </select>
        </div>

        {/* State Filter */}
        <div class="space-y-2">
          <label class="block text-sm font-medium text-secondary">
            State
          </label>
          <select
            value={networkState.filters.state}
            onChange={handleStateChange}
            class="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-on-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          >
            <option value="all">All</option>
            {PORT_STATES.map((state) => (
              <option value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* Search Filter */}
        <div class="space-y-2">
          <label class="block text-sm font-medium text-secondary">
            Process Name
          </label>
          <input
            type="text"
            placeholder="Search process..."
            value={searchInput()}
            onChange={handleSearchChange}
            class="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-on-background placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
        </div>

        {/* Clear Button */}
        <div class="flex items-end">
          <Show when={isFiltered()}>
            <button
              onClick={handleClearFilters}
              class="w-full px-4 py-2 bg-outline-variant hover:bg-outline-variant/80 text-on-background rounded-lg font-medium transition-colors duration-150 active:scale-95"
            >
              Clear Filters
            </button>
          </Show>
        </div>
      </div>

      {/* Active Filters Info */}
      <Show when={isFiltered()}>
        <div class="flex items-center gap-3 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg">
          <span class="text-sm text-primary font-medium">Active filters:</span>
          <div class="flex gap-2 flex-wrap">
            <Show when={networkState.filters.protocol !== "all"}>
              <span class="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-medium">
                Protocol: {networkState.filters.protocol}
              </span>
            </Show>
            <Show when={networkState.filters.state !== "all"}>
              <span class="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-medium">
                State: {networkState.filters.state}
              </span>
            </Show>
            <Show when={networkState.filters.searchTerm !== ""}>
              <span class="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-medium">
                Search: {networkState.filters.searchTerm}
              </span>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}
