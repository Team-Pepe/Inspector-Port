import { Router, Route } from "@solidjs/router";
import { Suspense, lazy } from "solid-js";
import Sidebar from "./components/common/Sidebar";
import Header from "./components/common/Header";

const Dashboard = lazy(() => import("./views/Dashboard/Dashboard"));
const Network = lazy(() => import("./views/Network/Network"));
const AIAssistant = lazy(() => import("./views/AIAssistant/AIAssistant"));
const Settings = lazy(() => import("./views/Settings/Settings"));

function Layout(props: any) {
  return (
    <div class="flex h-screen overflow-hidden bg-background text-on-background">
      <Sidebar />
      <main class="flex-1 flex flex-col overflow-hidden">
        <Header title="System Health" subtitle="Network / Active Ports" />
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <Suspense fallback={<div class="text-secondary text-center py-12">Loading...</div>}>
            {props.children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router root={Layout}>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/ports" component={Network} />
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/settings" component={Settings} />
    </Router>
  );
}
