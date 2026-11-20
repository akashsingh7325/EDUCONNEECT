import {
  Bot,
  BookOpen,
  House,
  MessageCircle,
  PlaySquare,
  UserRound,
  UsersRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", icon: House, path: "/home" },
  { label: "Library", icon: BookOpen, path: "/libarey" },
  { label: "Masters", icon: UsersRound, path: "/masters" },
  { label: "EduBot", icon: Bot, path: "/edubot" },
  { label: "Community", icon: MessageCircle, path: "/community" },
  { label: "Courses", icon: PlaySquare, path: "/courses" },
  { label: "Profile", icon: UserRound, path: "/profile" },
];

function BottomNavbar() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 px-2 pb-[env(safe-area-inset-bottom)] sm:bottom-4 sm:px-4"
    >
      <div className="nav-3d mx-auto flex w-full max-w-3xl items-stretch justify-between gap-0.5 overflow-x-auto rounded-t-2xl border border-white/10 bg-[#18181b]/95 px-1 py-1 backdrop-blur-xl sm:gap-1 sm:rounded-2xl sm:px-2 sm:py-2">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            aria-label={label}
            className={({ isActive }) =>
              `nav-item-3d flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:px-2 sm:py-2.5 sm:text-xs ${
              isActive
                ? "bg-violet-500/20 text-violet-300 shadow-sm"
                : "text-slate-400 hover:bg-white/5 hover:text-violet-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.4 : 2} aria-hidden="true" />
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNavbar;
