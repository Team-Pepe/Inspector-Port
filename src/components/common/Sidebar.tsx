import { A, useLocation } from "@solidjs/router";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { path: "/network", icon: "lan", label: "Network" },
    { path: "/resources", icon: "terminal", label: "Resources" },
    { path: "/ai-assistant", icon: "smart_toy", label: "AI Assistant" },
  ];

  return (
    <aside class="h-screen w-64 border-r border-outline bg-background flex flex-col h-full py-6 font-geist tracking-tight text-on-background">
      <div class="px-6 mb-8">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-on-primary">terminal</span>
          </div>
          <div>
            <h1 class="text-xl font-black text-primary">Obsidian</h1>
            <p class="text-xs uppercase tracking-widest text-secondary">System Monitoring</p>
          </div>
        </div>
      </div>
      <nav class="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <A
            href={item.path}
            class={`flex items-center gap-3 px-3 py-2 transition-colors duration-200 active:scale-[0.98] ${
              location.pathname === item.path
                ? "text-primary font-bold border-r-2 border-primary bg-surface-container"
                : "text-secondary hover:text-on-background hover:bg-outline-variant"
            }`}
          >
            <span class="material-symbols-outlined text-lg">{item.icon}</span>
            <span class="text-sm">{item.label}</span>
          </A>
        ))}
      </nav>
      <div class="mt-auto px-3 pt-6 border-t border-outline-variant space-y-1">
        <A
          href="/settings"
          class={`flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 ${
            location.pathname === "/settings"
              ? "text-primary font-bold border-r-2 border-primary bg-surface-container"
              : "text-secondary hover:text-on-background hover:bg-surface-container"
          }`}
        >
          <span class="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </A>
        <button class="flex items-center gap-3 px-3 py-2 text-secondary hover:text-on-background hover:bg-surface-container rounded transition-colors duration-200 w-full text-left">
          <span class="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}