import { useEffect, useState } from "react";
import { ClipboardCheck, Download, GraduationCap, MapPin, PlaySquare, Search } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import SettingsButton from "./settingsbutton";

function Logo() {
  const [hasLocation, setHasLocation] = useState(() => Boolean(localStorage.getItem("studentLocation")));

  useEffect(() => {
    const refreshLocation = () => setHasLocation(Boolean(localStorage.getItem("studentLocation")));
    window.addEventListener("student-location-updated", refreshLocation);
    window.addEventListener("storage", refreshLocation);
    return () => {
      window.removeEventListener("student-location-updated", refreshLocation);
      window.removeEventListener("storage", refreshLocation);
    };
  }, []);

  return (
    <header className="nav-3d sticky top-0 z-40 w-full border-b border-white/10 bg-[#09090b]/95 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-20 w-full flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:px-6 lg:px-8" aria-label="Top navigation">
        <Link to="/home" aria-label="EduConnect home" className="logo-3d group flex shrink-0 items-center gap-3 rounded-2xl px-2 py-1 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/30">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-700 text-white shadow-lg shadow-violet-950/50">
            <GraduationCap className="size-7" strokeWidth={2.2} />
          </span>
          <span>
            <strong className="block text-lg font-black tracking-[0.08em] text-white sm:text-xl">EDUCONNECT</strong>
            <small className="block text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300">Connect Learn Grow</small>
          </span>
        </Link>

        <div
          role="search"
          className="order-3 flex basis-full items-center rounded-2xl border border-white/10 bg-white/5 p-1.5 shadow-sm transition focus-within:border-violet-400 focus-within:bg-white/10 focus-within:ring-4 focus-within:ring-violet-500/20 sm:order-none sm:ml-auto sm:basis-auto sm:w-full sm:max-w-xl"
        >
          <label htmlFor="site-search" className="sr-only">
            Search for teachers, subjects, or locations
          </label>
          <input
            id="site-search"
            type="search"
            placeholder="Search teachers, subjects, or locations"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button
            type="button"
            className="button-3d inline-flex shrink-0 items-center gap-2 rounded-xl border-violet-900 bg-violet-700 px-4 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
          >
            <Search size={17} aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
          <NavLink
            to="/downloads"
            className={({ isActive }) => `inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20 ${isActive ? "border-violet-400/50 bg-violet-500/20 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:border-violet-400/40 hover:bg-violet-500/15 hover:text-white"}`}
          >
            <Download size={18} aria-hidden="true" />
            <span className="hidden xl:inline">Downloads</span>
          </NavLink>
          <NavLink
            to="/dpps"
            className={({ isActive }) => `inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20 ${isActive ? "border-violet-400/50 bg-violet-500/20 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:border-violet-400/40 hover:bg-violet-500/15 hover:text-white"}`}
          >
            <ClipboardCheck size={18} aria-hidden="true" />
            <span className="hidden xl:inline">DPPs</span>
          </NavLink>
        </div>

        <NavLink
          to="/courses"
          className={({ isActive }) => `inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20 ${isActive ? "border-violet-400/50 bg-violet-500/20 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:border-violet-400/40 hover:bg-violet-500/15 hover:text-white"}`}
        >
          <PlaySquare size={18} aria-hidden="true" />
          <span className="hidden xl:inline">Courses</span>
        </NavLink>

        <SettingsButton />

        <Link
          to="/profile"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-300 shadow-sm transition hover:border-violet-400/60 hover:bg-violet-500/20 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20" 
        >
          <MapPin size={19} aria-hidden="true" />
          <span>{hasLocation ? "Change Location" : "Set Location"}</span>
        </Link>
      </nav>
    </header>
  );
}

export default Logo;