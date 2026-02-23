import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { SidePattern } from "../components/SidePattern";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <main className="flex-1 p-8 md:p-16 bg-bg-1 overflow-y-auto">
          <Outlet />
        </main>
        <SidePattern />
      </div>
    </div>
  );
};
