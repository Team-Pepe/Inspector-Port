/**
 * Ports Table Component
 * Displays network ports in a table format with filtering and styling
 */

import { For, Show } from "solid-js";
import type { PortInfo } from "../../../types/network";
import { networkState } from "../stores/networkStore";

interface PortsTableProps {
  ports: PortInfo[];
  loading?: boolean;
}

const getStateColor = (state: string): string => {
  switch (state) {
    case "LISTENING":
      return "text-tertiary"; // Green
    case "ESTABLISHED":
      return "text-primary"; // Violet
    case "TIME_WAIT":
    case "CLOSE_WAIT":
      return "text-error"; // Red
    default:
      return "text-secondary"; // Gray
  }
};

const getStateBgColor = (state: string): string => {
  switch (state) {
    case "LISTENING":
      return "bg-tertiary/10"; // Light green background
    case "ESTABLISHED":
      return "bg-primary/10"; // Light violet background
    case "TIME_WAIT":
    case "CLOSE_WAIT":
      return "bg-error/10"; // Light red background
    default:
      return "bg-outline-variant"; // Gray background
  }
};

const getProtocolColor = (protocol: string): string => {
  switch (protocol) {
    case "TCP":
      return "bg-primary/20 text-primary"; // Violet
    case "UDP":
      return "bg-secondary/20 text-secondary"; // Gray
    default:
      return "bg-outline-variant text-on-background";
  }
};

export default function PortsTable(props: PortsTableProps) {
  return (
    <div class="space-y-4">
      {/* Table Header */}
      <div class="border-b border-outline-variant">
        <div class="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">
          <div class="col-span-1">Port</div>
          <div class="col-span-1">Protocol</div>
          <div class="col-span-3">Local Address</div>
          <div class="col-span-3">Remote Address</div>
          <div class="col-span-2">Process</div>
          <div class="col-span-1">PID</div>
          <div class="col-span-1">State</div>
        </div>
      </div>

      {/* Table Body */}
      <Show
        when={!props.loading && props.ports.length > 0}
        fallback={
          <div class="py-12 text-center text-secondary">
            <Show
              when={props.loading}
              fallback={
                <div>
                  <p class="text-lg font-medium text-on-background mb-2">
                    No ports found
                  </p>
                  <p class="text-sm">Try adjusting your filters</p>
                </div>
              }
            >
              <p class="text-lg font-medium text-on-background">
                Loading ports...
              </p>
            </Show>
          </div>
        }
      >
        <div class="space-y-px">
          <For each={props.ports}>
            {(port, index) => (
              <div
                class={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg transition-colors duration-150 hover:bg-outline-variant/50 ${
                  index() % 2 === 0
                    ? "bg-surface-container"
                    : "bg-surface-container-high"
                }`}
              >
                {/* Port */}
                <div class="col-span-1 flex items-center">
                  <span class="font-mono font-bold text-on-background">
                    {port.port}
                  </span>
                </div>

                {/* Protocol */}
                <div class="col-span-1 flex items-center">
                  <span
                    class={`px-2 py-1 rounded text-xs font-semibold ${getProtocolColor(
                      port.protocol
                    )}`}
                  >
                    {port.protocol}
                  </span>
                </div>

                {/* Local Address */}
                <div class="col-span-3 flex items-center">
                  <span class="font-mono text-sm text-on-background truncate">
                    {port.localAddress}
                  </span>
                </div>

                {/* Remote Address */}
                <div class="col-span-3 flex items-center">
                  <span class="font-mono text-sm text-secondary truncate">
                    {port.remoteAddress}
                  </span>
                </div>

                {/* Process */}
                <div class="col-span-2 flex items-center">
                  <span class="text-sm text-on-background truncate font-medium">
                    {port.processName}
                  </span>
                </div>

                {/* PID */}
                <div class="col-span-1 flex items-center">
                  <span class="font-mono text-sm text-secondary">
                    {port.pid}
                  </span>
                </div>

                {/* State */}
                <div class="col-span-1 flex items-center">
                  <span
                    class={`px-2 py-1 rounded text-xs font-semibold ${getStateColor(
                      port.state
                    )} ${getStateBgColor(port.state)}`}
                  >
                    {port.state}
                  </span>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      {/* Footer */}
      <Show when={props.ports.length > 0}>
        <div class="mt-6 pt-4 border-t border-outline-variant flex justify-between items-center text-sm text-secondary">
          <span>Total ports: {props.ports.length}</span>
          <Show when={networkState.lastUpdate}>
            <span>
              Last updated:{" "}
              {new Date(networkState.lastUpdate || 0).toLocaleTimeString()}
            </span>
          </Show>
        </div>
      </Show>
    </div>
  );
}
