
import Logo from "../components/navbar";
import BottomNavbar from "../components/bottomnavbar";
import { Outlet, useLocation } from "react-router-dom";

function StudentLayout() {
  const { pathname } = useLocation();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#09090b] text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-20 -z-10 h-72 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_38%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.10),transparent_36%)]"
      />
      {pathname !== "/settings" && <Logo />}

      <main className={`relative min-h-[calc(100vh-8rem)] w-full px-0 ${pathname === "/settings" ? "pb-0" : "pb-28"}`}>
        <Outlet />
      </main>

      {pathname !== "/" && pathname !== "/settings" && <BottomNavbar />}
    </div>
  );
}

export default StudentLayout;
