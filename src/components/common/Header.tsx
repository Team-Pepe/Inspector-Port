import { createSignal } from "solid-js";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header(props: HeaderProps) {
  const [searchQuery, setSearchQuery] = createSignal("");

  return (
    <header class="flex justify-between items-center px-6 py-3 sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-outline-variant font-geist text-sm font-medium">
      <div class="flex items-center gap-4">
        <span class="text-lg font-bold text-on-background">{props.title}</span>
        {props.subtitle && (
          <>
            <span class="h-4 w-[1px] bg-outline-variant"></span>
            <span class="text-secondary text-xs">{props.subtitle}</span>
          </>
        )}
      </div>
      <div class="flex items-center gap-6">
        <div class="relative group">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary text-sm">search</span>
          <input
            class="bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-1.5 text-xs focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background outline-none transition-all w-64"
            placeholder="Filter ports or processes..."
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            type="text"
          />
        </div>
        <div class="flex items-center gap-3">
          <button class="text-secondary hover:text-tertiary transition-colors duration-200 active:scale-90">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <button class="text-secondary hover:text-error transition-colors duration-200 active:scale-90">
            <span class="material-symbols-outlined">error</span>
          </button>
          <button class="text-secondary hover:text-tertiary transition-colors duration-200 active:scale-90">
            <span class="material-symbols-outlined">refresh</span>
          </button>
          <div class="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden border border-outline-variant hover:border-primary transition-colors">
            <img
              alt="User Avatar"
              class="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxXjIDGx4y57eNW0S1LGBKguasOSkCukHia3imHNMhE9_HXOlzKEZWcymC0PZlicuoM2fob0M_jDDzc3jamuViiuh59oTVHlV9R_pL1r6vhcBVQfleksnuG0nU_3LgbTF-B_bbm4t_Q88yExwOzeRPqLbqs4JWeZ-519SoGX_cCwiIa91pkL-IZ7A2Qb0jUKsIIO9NBa5-8WsSMlOUySqRYvqseK4U8TGO1jun65OiDzYJr004H0fMmCYyEhAW1jJsjFtGQNpCsWw"
            />
          </div>
        </div>
      </div>
    </header>
  );
}