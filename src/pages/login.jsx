import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, GraduationCap, LockKeyhole, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { login, register } from "../services/auth";

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  return (
    <main className="login-page relative min-h-screen overflow-hidden bg-[#09090b] px-4 py-6 text-left sm:px-6 sm:py-8">
      <div aria-hidden="true" className="login-grid absolute inset-0 opacity-50" />
      <div aria-hidden="true" className="login-glow absolute -left-32 top-1/4 size-96 rounded-full bg-violet-600/20 blur-[90px]" />
      <div aria-hidden="true" className="login-glow absolute -right-32 bottom-0 size-96 rounded-full bg-sky-500/15 blur-[100px]" />

      <button
        type="button"
        onClick={() => navigate("/home")}
        className="button-3d absolute right-4 top-5 z-30 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2.5 text-sm font-bold text-white backdrop-blur-xl sm:right-8 sm:top-8"
      >
        Skip for now <ArrowRight className="size-4" />
      </button>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_480px]">
        <section className="hidden px-4 lg:block">
          <div className="mb-8 flex size-16 items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-br from-violet-500 to-indigo-700 text-white shadow-2xl shadow-violet-950/50">
            <GraduationCap className="size-9" />
          </div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-200">
            <Sparkles className="size-4" /> Welcome to EduConnect
          </div>
          <h1 className="mb-0 max-w-xl text-6xl font-black leading-[1.02] tracking-[-0.055em] text-white xl:text-7xl">
            Your learning journey starts here.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300">
            Learn from verified masters, practise every day, and grow with a community that keeps you moving forward.
          </p>
          <div className="mt-10 flex gap-4">
            {["Personal learning", "Trusted teachers", "Progress tracking"].map((item, index) => (
              <div key={item} className="card-3d min-w-36 rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
                <span className="mb-3 flex size-9 items-center justify-center rounded-xl bg-violet-500/20 text-sm font-black text-violet-200">0{index + 1}</span>
                <p className="text-sm font-bold text-white">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card-3d scene-3d mx-auto w-full max-w-md rounded-[28px] border border-white/10 bg-[#15151c]/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-7">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">EduConnect account</p>
              <h2 className="mb-0 mt-2 text-3xl font-black text-white">{mode === "login" ? "Welcome back" : "Create account"}</h2>
            </div>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
              <ShieldCheck className="size-6" />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/10 bg-slate-950/50 p-1">
            {[["login", "Log in"], ["signup", "Sign up"]].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => { setMode(value); setStatus(""); }}
                className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${mode === value ? "bg-violet-600 text-white shadow-lg shadow-violet-950/40" : "text-slate-400 hover:text-white"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setStatus("Please wait...");
              try {
                const user = mode === "signup"
                  ? await register(name, email, password)
                  : await login(email, password);
                setStatus(mode === "login" ? "Signed in successfully." : "Your account has been created.");
                setTimeout(() => navigate(user.role === "ADMIN" ? "/admin" : user.role === "TEACHER" ? "/teacher/dashboard" : "/home"), 650);
              } catch (error) {
                setStatus(error.message);
              }
            }}
            className="space-y-4"
          >
            {mode === "signup" && (
              <label className="block text-sm font-bold text-slate-300">
                <span className="mb-2 block">Full name</span>
                <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10">
                  <UserRound className="size-5 shrink-0 text-slate-500" />
                  <input value={name} onChange={(event) => setName(event.target.value)} required className="min-w-0 flex-1 bg-transparent py-3.5 text-white outline-none placeholder:text-slate-600" placeholder="Enter your name" />
                </span>
              </label>
            )}

            <label className="block text-sm font-bold text-slate-300">
              <span className="mb-2 block">Email address</span>
              <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10">
                <Mail className="size-5 shrink-0 text-slate-500" />
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="min-w-0 flex-1 bg-transparent py-3.5 text-white outline-none placeholder:text-slate-600" placeholder="you@example.com" />
              </span>
            </label>

            <label className="block text-sm font-bold text-slate-300">
              <span className="mb-2 block">Password</span>
              <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10">
                <LockKeyhole className="size-5 shrink-0 text-slate-500" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} className="min-w-0 flex-1 bg-transparent py-3.5 text-white outline-none placeholder:text-slate-600" placeholder="At least 6 characters" />
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-slate-500 transition hover:text-violet-300" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button>
              </span>
            </label>

            {status && <p className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">{status}</p>}

            <button type="submit" className="landing-primary button-3d flex w-full items-center justify-center gap-2 rounded-xl border-violet-400/40 bg-violet-600 px-5 py-4 font-bold text-white">
              {mode === "login" ? "Log in" : "Create account"} <ArrowRight className="size-5" />
            </button>
          </form>

          <button type="button" onClick={() => navigate("/home")} className="mt-5 w-full text-center text-sm font-semibold text-slate-400 transition hover:text-white">
            Continue as a guest
          </button>
        </section>
      </div>
    </main>
  );
}

export default Login;
