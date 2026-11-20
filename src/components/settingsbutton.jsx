import { Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

function SettingsButton({ className = "", showLabel = true }) {
  return (
    <NavLink
      to="/settings"
      aria-label="Open settings"
      title="Settings"
      className={({ isActive }) =>
        `button-3d inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20 ${
          isActive
            ? "border-violet-400/50 bg-violet-500/20 text-white"
            : "border-white/10 bg-white/5 text-slate-300 hover:border-violet-400/40 hover:bg-violet-500/15 hover:text-white"
        } ${className}`
      }
    >
      <Settings size={19} aria-hidden="true" />
      {showLabel && <span className="hidden xl:inline">Settings</span>}
    </NavLink>
  );
}

export default SettingsButton;
