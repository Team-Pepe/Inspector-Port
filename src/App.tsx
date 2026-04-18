import { Router, Route } from "@solidjs/router";
import Sidebar from "./components/common/Sidebar";
import Header from "./components/common/Header";
import Dashboard from "./views/Dashboard/Dashboard";
import Network from "./views/Network/Network";
import Resources from "./views/Resources/Resources";
import AIAssistant from "./views/AIAssistant/AIAssistant";
import Settings from "./views/Settings/Settings";

function AppLayout() {
  return (
    <div class="flex h-screen overflow-hidden bg-background text-on-background">
      <Sidebar />
      <main class="flex-1 flex flex-col overflow-hidden">
        <Header title="System Health" subtitle="Network / Active Ports" />
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Content will be rendered here by routes */}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router root={AppLayout}>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/ports" component={Network} />
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/settings" component={Settings} />
    </Router>
  );
}
