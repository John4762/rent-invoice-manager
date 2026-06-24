import { NavLink } from "react-router-dom";
import { Eye, FileText, Settings, Users } from "lucide-react";

const navItems = [
  {
    label: "Generate Invoices",
    path: "/",
    icon: FileText,
  },
  {
    label: "Preview Invoices",
    path: "/preview",
    icon: Eye,
  },
  {
    label: "Tenants",
    path: "/tenants",
    icon: Users,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <aside
      className="
    m-4
    flex
    w-68
    flex-col
    rounded-3xl
    border
    border-zinc-800
    bg-zinc-900/80
    backdrop-blur-xl
    shadow-2xl
  "
    >
      <div className="p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
          Rent Invoice Manager
        </h1>

        <p className="text-sm text-zinc-400">Invoice Management System</p>
      </div>

      <div className="mx-4 h-px bg-zinc-800" />

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
                  ${
                    isActive
                      ? "bg-zinc-800/90 ring-1ring-zinc-700 text-white shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                  }
                `
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="mx-4 h-px bg-zinc-800" />

      <div className="p-5 text-xs text-zinc-500">Version 0.1.0</div>
    </aside>
  );
}
