import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/shared/components/SiteHeader";
import { SiteFooter } from "@/shared/components/SiteFooter";
import { MobileBottomNav } from "@/shared/components/MobileBottomNav";

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  );
}
