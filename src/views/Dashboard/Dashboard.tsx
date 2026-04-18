import MetricsCard from "../../components/common/MetricsCard";
import NetworkTable from "../../components/ui/NetworkTable";

export default function Dashboard() {
  return (
    <div class="space-y-6">
      <div class="grid grid-cols-4 gap-4">
        <MetricsCard
          title="Active Connections"
          value="1,284"
          change={{ value: "12%", type: "positive" }}
        />
        <MetricsCard
          title="Listening Ports"
          value="42"
          change={{ value: "Stable", type: "neutral" }}
        />
        <MetricsCard
          title="Dropped Packets"
          value="0.02%"
          change={{ value: "High", type: "negative" }}
        />
        <MetricsCard
          title="Network Load"
          value="42 MB/s"
          change={{ value: "Nominal", type: "neutral" }}
        />
      </div>
      <NetworkTable />
    </div>
  );
}