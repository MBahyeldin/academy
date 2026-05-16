import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/shared/components/SiteHeader";
import { MobileBottomNav } from "@/shared/components/MobileBottomNav";

export function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <MobileBottomNav />
    </div>
  );
}
