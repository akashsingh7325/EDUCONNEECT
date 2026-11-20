import { useEffect, useMemo, useState } from "react";
import { ArrowRight, GraduationCap, Search, Star, UsersRound } from "lucide-react";
import { getTeachers } from "../services/teachers";

function Masters() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getTeachers({ search: query || undefined, subject: subject !== "All" ? subject : undefined })
      .then((body) => { if (active) setMasters(body?.data?.teachers || []); })
      .catch((requestError) => { if (active) setError(requestError?.message || "Could not load masters."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query, subject]);

  const subjects = useMemo(() => ["All", ...new Set(masters.map((teacher) => teacher.primarySubject).filter(Boolean))], [masters]);

  return (
    <main className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <section className="hero-3d scene-3d relative overflow-hidden rounded-[2rem] border border-white/10 px-6 py-10 text-left sm:px-10 lg:min-h-[420px]">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200"><UsersRound className="size-4" /> Find your mentor</span>
          <h1 className="mb-0 mt-6 text-4xl font-black text-white sm:text-6xl">Explore Masters</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">Connect with verified educators, compare learning styles, and grow with someone who understands your goals.</p>
          <div className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <label className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/70 px-4 shadow-xl focus-within:border-violet-400"><Search className="size-5 text-violet-300" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent py-2 text-white outline-none placeholder:text-slate-500" placeholder="Search name or subject" /></label>
            {subjects.length > 1 && <select value={subject} onChange={(event) => setSubject(event.target.value)} aria-label="Filter subject" className="min-h-14 rounded-2xl border border-white/15 bg-slate-950/70 px-4 text-sm text-white outline-none">{subjects.map((item) => <option key={item}>{item}</option>)}</select>}
          </div>
        </div>
      </section>

      {loading && <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] py-14 text-center text-sm text-slate-400">Loading teachers...</section>}
      {error && <section role="alert" className="mt-8 rounded-3xl border border-rose-400/20 bg-rose-500/10 px-6 py-5 text-sm text-rose-200">{error}</section>}
      {!loading && !error && <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {masters.map((teacher) => {
          const name = teacher.user?.fullName || teacher.user?.username || "EduConnect Teacher";
          return <article key={teacher.id} className="card-3d scene-3d rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left"><div className="avatar-3d mb-8 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-700 text-white"><GraduationCap className="size-8" /></div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">{teacher.primarySubject || "Verified teacher"}</p><h2 className="mb-2 mt-3 text-2xl text-white">{name}</h2><div className="mb-6 flex items-center gap-1 text-sm text-amber-300"><Star className="size-4 fill-amber-400" /> {Number(teacher.ratingAverage || 0).toFixed(1)} rating</div><span className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 font-bold text-violet-200"><ArrowRight className="size-4" /> Verified educator</span></article>;
        })}
      </section>}
      {!loading && !error && masters.length === 0 && <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] py-14 text-center"><GraduationCap className="mx-auto size-10 text-violet-400" /><p className="mt-3 font-semibold text-white">No teachers found</p><p className="mt-1 text-sm text-slate-400">Try a different name or subject.</p></section>}
    </main>
  );
}
export default Masters;
