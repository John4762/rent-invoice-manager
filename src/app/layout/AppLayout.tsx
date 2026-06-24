import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div className="h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
  <div className="flex h-full">
      <Sidebar />

      <main className="flex-1 p-4">
        <div
          className="
      h-full
      overflow-auto
      rounded-3xl
      border
      border-zinc-700
      bg-zinc-900
      shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
      backdrop-blur-sm
      p-10
    "
        >
          <Outlet />
        </div>
      </main>
    </div>
    </div>
  );
}
