import { NavLink } from "react-router-dom";
import {
  Eye,
  FileText,
  Settings,
  Users,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

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
    <aside className="flex h-full w-72 flex-col border-r bg-background">
      <div className="p-6">
        <h1 className="text-lg font-bold">
          Rent Invoice Manager
        </h1>

        <p className="text-sm text-muted-foreground">
          Invoice Management System
        </p>
      </div>

      <Separator />

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
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
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

      <Separator />

      <div className="p-4 text-xs text-muted-foreground">
        Version 0.1.0
      </div>
    </aside>
  );
}