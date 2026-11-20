import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, ClipboardCheck, Library, GraduationCap, CreditCard, BarChart3, ShieldCheck, ScrollText, Settings, Menu, X, LogOut, Bell, Search } from "lucide-react";
import { logout } from "../../services/auth";

const items = [
  ["Overview", "/admin", LayoutDashboard], ["Users", "/admin/users", Users], ["Courses", "/admin/courses", GraduationCap],
  ["DPPs", "/admin/dpps", ClipboardCheck], ["Materials", "/admin/materials", BookOpen], ["Library", "/admin/library", Library],
  ["Admissions", "/admin/admissions", GraduationCap], ["Payments", "/admin/payments", CreditCard], ["Analytics", "/admin/analytics", BarChart3],
  ["Roles", "/admin/roles", ShieldCheck], ["Audit Logs", "/admin/audit-logs", ScrollText], ["Settings", "/admin/settings", Settings],
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const profile = (() => { try { return JSON.parse(localStorage.getItem("educonnectProfile") || "{}"); } catch { return {}; } })();
  const handleLogout = async () => { await logout(); navigate("/admin/login", { replace: true }); };
  return <div className="min-h-screen bg-slate-100 text-slate-900">
    {open && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-20 items-center justify-between px-6"><button onClick={() => navigate("/admin")} className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white">EC</span><span className="text-lg font-black tracking-tight">EduConnect</span></button><button className="lg:hidden" onClick={() => setOpen(false)}><X className="size-5" /></button></div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">{items.map(([label, to, Icon]) => <NavLink key={to} to={to} end={to === "/admin"} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}><Icon className="size-5" />{label}</NavLink>)}</nav>
      <button onClick={handleLogout} className="mx-3 mb-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-red-600 hover:bg-red-50"><LogOut className="size-5" />Sign out</button>
    </aside>
    <div className="lg:pl-64"><header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7"><div className="flex items-center gap-3"><button className="rounded-xl border border-slate-200 p-2 lg:hidden" onClick={() => setOpen(true)}><Menu className="size-5" /></button><div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:flex"><Search className="size-4 text-slate-400" /><input className="w-48 bg-transparent text-sm outline-none" placeholder="Search dashboard" /></div></div><div className="flex items-center gap-3"><button className="relative rounded-xl border border-slate-200 p-2.5"><Bell className="size-5 text-slate-600" /><span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" /></button><div className="text-right"><p className="text-sm font-bold">{profile.fullName || "Administrator"}</p><p className="text-xs text-slate-500">Admin</p></div><span className="flex size-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white">{(profile.fullName || "A").charAt(0).toUpperCase()}</span></div></header><main className="min-h-[calc(100vh-5rem)] p-4 sm:p-7"><Outlet /></main></div>
  </div>;
}
