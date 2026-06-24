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
    <aside className="w-64 border-r p-4">
      <h1 className="mb-8 text-xl font-bold">
        Rent Invoice Manager
      </h1>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? "bg-muted font-medium"
                    : "hover:bg-muted/50"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}