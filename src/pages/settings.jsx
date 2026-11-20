import { useEffect, useState } from "react";
import { ArrowDown, Bell, BookOpen, ChevronRight, Laptop, Mail, MonitorSmartphone, Palette, ShieldCheck, Smartphone, UserRound, X } from "lucide-react";
import { applyTheme } from "../theme";

const defaults = {
  fullName: "", email: "", phone: "",
  language: "English", timezone: "India Standard Time", username: "", pushNotifications: true,
  emailNotifications: true, classReminders: true, communityUpdates: false,
  theme: "Dark", soundEffects: true, compactMode: false, learningLevel: "Intermediate",
  studyGoal: "Competitive Exams", dailyGoal: 60, profileVisibility: "Learning circle",
  twoFactor: false, locationSharing: true,
};

function Toggle({ checked, onChange, label }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full border transition ${checked ? "border-emerald-400 bg-emerald-500" : "border-slate-600 bg-slate-700"}`}><span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[20px]" : "translate-x-0.5"}`} /></button>;
}

function Row({ title, description, action }) {
  return <div className="flex items-center justify-between gap-5 border-b border-white/[0.06] px-1 py-4"><div className="min-w-0"><p className="text-sm font-semibold text-white sm:text-base">{title}</p>{description && <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">{description}</p>}</div>{action}</div>;
}

const menuSections = {
  general: [{ id: "account", label: "Account Settings", icon: UserRound }, { id: "notifications", label: "Notifications", icon: Bell }, { id: "appearance", label: "Appearance", icon: Palette }, { id: "learning", label: "Learning Preferences", icon: BookOpen }],
  security: [{ id: "privacy", label: "Privacy & Security", icon: ShieldCheck }, { id: "sessions", label: "Active Sessions", icon: Laptop }],
  support: [{ id: "support", label: "Help & Support", icon: Mail }],
};

function Settings() {
  const [settings, setSettings] = useState(defaults);
  const [active, setActive] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let profile = null;
    try { profile = JSON.parse(localStorage.getItem("educonnectCurrentUser") || localStorage.getItem("educonnectProfile") || "null"); } catch {}

    try {
      const stored = JSON.parse(localStorage.getItem("educonnectSettings") || "null");
      const merged = { ...defaults, ...(stored || {}) };
      if (profile?.fullName) merged.fullName = profile.fullName;
      if (profile?.email) merged.email = profile.email;
      merged.username = profile?.username || (profile?.email ? profile.email.split("@")[0] : "");
      setSettings(merged);
      if (merged.theme) applyTheme(merged.theme);
      if (merged.compactMode) document.documentElement.dataset.compact = "true";
    } catch {
      localStorage.removeItem("educonnectSettings");
    }

    const refreshProfile = () => {
      try {
        const nextProfile = JSON.parse(localStorage.getItem("educonnectCurrentUser") || localStorage.getItem("educonnectProfile") || "null");
        if (nextProfile) setSettings((current) => ({ ...current, fullName: nextProfile.fullName || current.fullName, email: nextProfile.email || current.email, username: nextProfile.username || (nextProfile.email ? nextProfile.email.split("@")[0] : current.username) }));
      } catch {}
    };
    window.addEventListener("educonnect-profile-updated", refreshProfile);
    return () => window.removeEventListener("educonnect-profile-updated", refreshProfile);
  }, []);

  const update = (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next); setSaved(false);
    if (key === "theme") applyTheme(value);
    if (key === "compactMode") document.documentElement.dataset.compact = String(value);
  };

  const save = () => {
    localStorage.setItem("educonnectSettings", JSON.stringify(settings));
    const username = settings.username?.trim() || settings.email?.trim().split("@")[0] || "profile";
    const profile = { fullName: settings.fullName, email: settings.email, phone: settings.phone, username };
    localStorage.setItem("educonnectProfile", JSON.stringify(profile));
    localStorage.setItem("educonnectCurrentUser", JSON.stringify(profile));
    window.dispatchEvent(new Event("educonnect-settings-updated")); setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const selectClass = "rounded-lg border border-white/10 bg-[#09090b] px-3 py-2 text-sm text-white outline-none focus:border-violet-400";
  const inputClass = "mt-2 w-full rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-sm text-white outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/15";
  const menuItem = ({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => { setActive(id); setSaved(false); }} className="flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left text-[17px] text-slate-100 transition hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:px-7"><Icon className="size-5 shrink-0 text-slate-300" strokeWidth={1.8} /><span className="flex-1">{label}</span><ChevronRight className="size-4 text-slate-600 opacity-0 transition group-hover:opacity-100" /></button>;

  return <div className="min-h-[calc(100vh-80px)] w-full bg-[#09090b] text-left text-white">
    <header className="flex h-[60px] items-center justify-between border-b border-white/[0.04] px-4 sm:px-[15px]"><span className="text-lg font-extrabold tracking-tight">EduConnect</span><span className="text-sm font-medium text-emerald-400">Settings preview</span></header>
    <div className="w-full px-3 pb-28 pt-5 sm:px-4 sm:pt-8">
      <div className="mb-[54px] flex items-center gap-4 px-0 sm:px-3"><div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#111827] text-slate-300 ring-1 ring-white/[0.06]"><UserRound className="size-7" strokeWidth={1.8} /></div><div><p className="text-lg font-bold leading-tight">{settings.fullName || "Profile"}</p><p className="mt-1 text-sm text-slate-400">@{settings.username || settings.email?.split("@")[0] || "profile"}</p></div></div>
      <section><h2 className="mb-2 text-sm font-black uppercase tracking-wide text-slate-200">General</h2><div>{menuSections.general.map(menuItem)}</div></section>
      <section className="mt-12"><h2 className="mb-2 text-sm font-black uppercase tracking-wide text-slate-200">Security</h2><div>{menuSections.security.map(menuItem)}</div></section>
      <section className="mt-12"><h2 className="mb-2 text-sm font-black uppercase tracking-wide text-slate-200">Support</h2><div>{menuSections.support.map(menuItem)}</div><button type="button" aria-label="Scroll to support options" onClick={() => document.querySelector("[data-support-detail]")?.scrollIntoView({ behavior: "smooth" })} className="mx-auto mt-4 flex size-12 items-center justify-center rounded-full border border-white/10 bg-[#111827] text-slate-300 transition hover:border-violet-400 hover:text-white"><ArrowDown className="size-5" /></button></section>
    </div>

    {active && <div className="fixed inset-x-3 bottom-3 z-[60] max-h-[calc(100vh-96px)] overflow-y-auto rounded-2xl border border-white/10 bg-[#15151a] shadow-2xl shadow-black/70 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:top-[82px] sm:w-[460px]" role="dialog" aria-modal="true" aria-label={active}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#15151a] px-5 py-4"><h2 className="text-lg font-bold capitalize">{active}</h2><button type="button" onClick={() => setActive(null)} aria-label="Close settings panel" className="flex size-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white"><X className="size-5" /></button></div>
      <div className="p-5 sm:p-6">
        {active === "account" && <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm text-slate-300 sm:col-span-2">Full name<input className={inputClass} value={settings.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Your name" /></label><label className="text-sm text-slate-300 sm:col-span-2">Username<input className={inputClass} value={settings.username} onChange={(e) => update("username", e.target.value.replace(/[^a-zA-Z0-9_.]/g, ""))} placeholder="your_username" /></label><label className="text-sm text-slate-300 sm:col-span-2">Email address<input type="email" className={inputClass} value={settings.email} onChange={(e) => update("email", e.target.value)} /></label><label className="text-sm text-slate-300 sm:col-span-2">Phone number<input type="tel" className={inputClass} value={settings.phone} onChange={(e) => update("phone", e.target.value)} /></label><label className="text-sm text-slate-300">Language<select className={`${inputClass} appearance-auto`} value={settings.language} onChange={(e) => update("language", e.target.value)}><option>English</option><option>Hindi</option><option>Bengali</option><option>Telugu</option></select></label><label className="text-sm text-slate-300">Time zone<select className={`${inputClass} appearance-auto`} value={settings.timezone} onChange={(e) => update("timezone", e.target.value)}><option>India Standard Time</option><option>UTC</option><option>Eastern Standard Time</option></select></label></div>}
        {active === "notifications" && <div><Row title="Push notifications" description="Notifications on this device" action={<Toggle checked={settings.pushNotifications} onChange={(v) => update("pushNotifications", v)} label="Push notifications" />} /><Row title="Email notifications" description="Course and account updates by email" action={<Toggle checked={settings.emailNotifications} onChange={(v) => update("emailNotifications", v)} label="Email notifications" />} /><Row title="Class reminders" description="Reminders before live classes" action={<Toggle checked={settings.classReminders} onChange={(v) => update("classReminders", v)} label="Class reminders" />} /><Row title="Community updates" description="Replies, mentions, and activity" action={<Toggle checked={settings.communityUpdates} onChange={(v) => update("communityUpdates", v)} label="Community updates" />} /></div>}
        {active === "appearance" && <div><Row title="Theme" description="Choose the app appearance" action={<div className="flex gap-1 rounded-lg border border-white/10 bg-[#09090b] p-1"><button type="button" aria-pressed={settings.theme === "Dark"} onClick={() => update("theme", "Dark")} className={`rounded-md px-3 py-2 text-xs font-bold ${settings.theme === "Dark" ? "bg-violet-600 text-white" : "text-slate-400"}`}>Dark</button><button type="button" aria-pressed={settings.theme === "Light"} onClick={() => update("theme", "Light")} className={`rounded-md px-3 py-2 text-xs font-bold ${settings.theme === "Light" ? "bg-violet-600 text-white" : "text-slate-400"}`}>Light</button></div>} /><Row title="Compact mode" description="Fit more content on screen" action={<Toggle checked={settings.compactMode} onChange={(v) => update("compactMode", v)} label="Compact mode" />} /><Row title="Sound effects" description="Play sounds for app actions" action={<Toggle checked={settings.soundEffects} onChange={(v) => update("soundEffects", v)} label="Sound effects" />} /></div>}
        {active === "learning" && <div><Row title="Learning level" description="Personalize course recommendations" action={<select aria-label="Learning level" className={selectClass} value={settings.learningLevel} onChange={(e) => update("learningLevel", e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>} /><Row title="Primary goal" description="Choose what you are preparing for" action={<select aria-label="Primary goal" className={selectClass} value={settings.studyGoal} onChange={(e) => update("studyGoal", e.target.value)}><option>Competitive Exams</option><option>School Curriculum</option><option>Skill Development</option></select>} /><Row title="Daily study goal" description="Minutes to aim for each day" action={<select aria-label="Daily study goal" className={selectClass} value={settings.dailyGoal} onChange={(e) => update("dailyGoal", Number(e.target.value))}><option value={30}>30 min</option><option value={60}>60 min</option><option value={90}>90 min</option><option value={120}>2 hours</option></select>} /></div>}
        {active === "privacy" && <div><Row title="Profile visibility" description="Control who can view your profile" action={<select aria-label="Profile visibility" className={selectClass} value={settings.profileVisibility} onChange={(e) => update("profileVisibility", e.target.value)}><option>Learning circle</option><option>Everyone</option><option>Private</option></select>} /><Row title="Two-factor authentication" description="Extra verification when signing in" action={<Toggle checked={settings.twoFactor} onChange={(v) => update("twoFactor", v)} label="Two-factor authentication" />} /><Row title="Share location" description="Improve nearby teacher recommendations" action={<Toggle checked={settings.locationSharing} onChange={(v) => update("locationSharing", v)} label="Share location" />} /></div>}
        {active === "sessions" && <div className="space-y-3"><div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4"><div className="flex items-center gap-3"><MonitorSmartphone className="size-5 text-emerald-400" /><div><p className="font-semibold">This device</p><p className="text-xs text-slate-400">Current session · Active now</p></div></div></div><div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4"><div className="flex items-center gap-3"><Smartphone className="size-5 text-slate-400" /><div><p className="font-semibold">Mobile browser</p><p className="text-xs text-slate-400">Last used 2 hours ago</p></div></div></div><button type="button" onClick={() => alert("All other sessions have been signed out.")} className="mt-2 w-full rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-500/20">Sign out of other sessions</button></div>}
        {active === "support" && <div data-support-detail className="space-y-3"><a href="mailto:support@educonnect.app?subject=EduConnect Support" className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-white hover:bg-white/[0.06]"><Mail className="size-5 text-violet-400" /><div><p className="font-semibold">Contact support</p><p className="text-xs text-slate-400">support@educonnect.app</p></div></a><button type="button" onClick={() => alert("Opening the EduConnect help center.")} className="flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-left hover:bg-white/[0.06]"><BookOpen className="size-5 text-violet-400" /><div><p className="font-semibold">Help center</p><p className="text-xs text-slate-400">Guides and frequently asked questions</p></div></button></div>}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-5">{saved && <span className="mr-auto text-sm font-medium text-emerald-300">Changes saved</span>}<button type="button" onClick={save} className="w-full rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/30 hover:bg-violet-500">Save changes</button></div>
      </div>
    </div>}
  </div>;
}
export default Settings;
