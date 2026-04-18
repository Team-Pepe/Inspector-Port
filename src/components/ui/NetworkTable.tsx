import { createSignal, For } from "solid-js";
import Button from "./Button";

interface NetworkConnection {
  id: string;
  port: string;
  protocol: string;
  process: string;
  pid: number;
  state: "LISTENING" | "ESTABLISHED" | "TIME_WAIT";
  activity: string;
}

const mockData: NetworkConnection[] = [
  {
    id: "1",
    port: "3000",
    protocol: "TCP",
    process: "node",
    pid: 1234,
    state: "LISTENING",
    activity: "—",
  },
  {
    id: "2",
    port: "5432",
    protocol: "TCP",
    process: "postgres",
    pid: 5678,
    state: "LISTENING",
    activity: "↔ 12.4 MB/s",
  },
  {
    id: "3",
    port: "8080",
    protocol: "TCP",
    process: "docker",
    pid: 2345,
    state: "ESTABLISHED",
    activity: "↔ 8.2 MB/s",
  },
  {
    id: "4",
    port: "22",
    protocol: "TCP",
    process: "sshd",
    pid: 890,
    state: "LISTENING",
    activity: "—",
  },
  {
    id: "5",
    port: "53",
    protocol: "UDP",
    process: "systemd-resolved",
    pid: 123,
    state: "LISTENING",
    activity: "↔ 0.3 MB/s",
  },
  {
    id: "6",
    port: "443",
    protocol: "TCP",
    process: "nginx",
    pid: 4567,
    state: "LISTENING",
    activity: "↔ 24.7 MB/s",
  },
];

export default function NetworkTable() {
  const [expandedRow, setExpandedRow] = createSignal<string | null>(null);

  const getStateColor = (state: string) => {
    switch (state) {
      case "LISTENING":
        return "bg-tertiary-container text-tertiary";
      case "ESTABLISHED":
        return "bg-primary-container text-primary";
      case "TIME_WAIT":
        return "bg-error/10 text-error";
      default:
        return "bg-surface-container text-secondary";
    }
  };

  return (
    <div class="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
      {/* Table Header */}
      <div class="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary">dns</span>
          <h3 class="font-bold text-on-background text-sm">Network Stack Topology</h3>
        </div>
        <div class="flex gap-2">
          <Button variant="secondary" size="sm">
            Export CSV
          </Button>
          <Button variant="primary" size="sm">
            Flush Rules
          </Button>
        </div>
      </div>

      {/* Table Body */}
      <div class="overflow-x-auto">
        <table class="w-full text-xs">
          <thead class="bg-surface-container-low border-b border-outline-variant text-secondary">
            <tr>
              <th class="px-6 py-3 text-left font-bold uppercase tracking-wider">Port</th>
              <th class="px-6 py-3 text-left font-bold uppercase tracking-wider">Protocol</th>
              <th class="px-6 py-3 text-left font-bold uppercase tracking-wider">Process</th>
              <th class="px-6 py-3 text-left font-bold uppercase tracking-wider">PID</th>
              <th class="px-6 py-3 text-left font-bold uppercase tracking-wider">State</th>
              <th class="px-6 py-3 text-left font-bold uppercase tracking-wider">Activity</th>
            </tr>
          </thead>
          <tbody>
            <For each={mockData}>
              {(connection, index) => (
                <tr
                  class={`border-b border-outline-variant transition-colors ${
                    index() % 2 === 0
                      ? "bg-surface-container"
                      : "bg-surface-container-low"
                  } hover:bg-surface-container-high cursor-pointer`}
                  onClick={() =>
                    setExpandedRow(
                      expandedRow() === connection.id ? null : connection.id
                    )
                  }
                >
                  <td class="px-6 py-3 font-mono text-primary font-bold">
                    {connection.port}
                  </td>
                  <td class="px-6 py-3">
                    <span
                      class={`px-2 py-1 rounded text-xs font-bold ${
                        connection.protocol === "TCP"
                          ? "bg-primary/10 text-primary"
                          : "bg-tertiary/10 text-tertiary"
                      }`}
                    >
                      {connection.protocol}
                    </span>
                  </td>
                  <td class="px-6 py-3 text-on-background font-semibold">
                    {connection.process}
                  </td>
                  <td class="px-6 py-3 text-secondary">{connection.pid}</td>
                  <td class="px-6 py-3">
                    <span
                      class={`px-2 py-1 rounded text-xs font-bold ${getStateColor(
                        connection.state
                      )}`}
                    >
                      {connection.state}
                    </span>
                  </td>
                  <td class="px-6 py-3 text-tertiary font-semibold">
                    {connection.activity}
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div class="px-6 py-3 bg-surface-container-low border-t border-outline-variant text-xs text-secondary flex justify-between items-center">
        <span>Showing {mockData.length} active connections</span>
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined text-xs">info</span>
          Last updated: Now
        </span>
      </div>
    </div>
  );
}
