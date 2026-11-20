import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import Teacherscard from "../components/teachercard";
import Categorycard from "../components/categorycard";
import Footer from "../components/footer";
import SpecialisedChildren from "../components/specialisedchildren";
import { getTeachers } from "../services/teachers";
import { getCourses } from "../services/phase4";

function Home() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [courseCount, setCourseCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getTeachers({ limit: 6 }), getCourses()])
      .then(([teacherBody, courseBody]) => {
        if (!active) return;
        setTeachers((teacherBody?.data?.teachers || []).map((teacher) => ({
          id: teacher.id,
          name: teacher.user?.fullName || teacher.user?.username || "EduConnect Teacher",
          subject: teacher.primarySubject || "Multiple subjects",
          experience: teacher.experienceYears,
          location: teacher.location || "Online",
          rating: Number(teacher.ratingAverage || 0).toFixed(1),
          monthlyFee: teacher.monthlyFee,
          reviewCount: teacher.reviewCount || 0,
        })));
        setCourseCount(courseBody?.data?.pagination?.total ?? (courseBody?.data?.courses || []).length);
        setTeacherCount(teacherBody?.data?.pagination?.total ?? (teacherBody?.data?.teachers || []).length);
      })
      .catch(() => {
        if (active) {
          setTeachers([]);
          setCourseCount(0);
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const averageRating = useMemo(() => {
    if (!teachers.length) return "0.0";
    return (teachers.reduce((sum, teacher) => sum + Number(teacher.rating || 0), 0) / teachers.length).toFixed(1);
  }, [teachers]);

  return (
    <div className="landing-page w-full px-3 pb-8 pt-3 sm:px-5 sm:pt-5 lg:px-8">
      <section className="landing-hero scene-3d relative isolate w-full overflow-hidden rounded-[28px] border border-white/10">
        <div aria-hidden="true" className="landing-grid absolute inset-0" />
        <div aria-hidden="true" className="landing-orb landing-orb-one" />
        <div aria-hidden="true" className="landing-orb landing-orb-two" />
        <div className="relative z-10 flex min-h-[560px] items-center px-6 py-12 text-left sm:min-h-[620px] sm:px-10 lg:px-16 xl:min-h-[680px]">
          <div className="hero-copy-3d max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-200 backdrop-blur-xl">
              <Sparkles className="size-4" /> Learning made personal
            </div>
            <h1 className="landing-title mb-5 text-[44px] font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-[64px] lg:text-[82px]">
              Learn beyond<span className="landing-title-accent block">the classroom.</span>
            </h1>
            <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg lg:text-xl">
              Connect with verified teachers, explore practical resources, and build the skills that shape your future.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button type="button" className="landing-primary button-3d inline-flex items-center gap-3 rounded-2xl border-violet-400/40 bg-violet-600 px-6 py-4 text-sm font-bold text-white sm:px-7" onClick={() => navigate("/masters")}>Find a master <ArrowRight className="size-5" /></button>
              <button type="button" className="landing-secondary inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/10" onClick={() => navigate("/libarey")}><span className="flex size-8 items-center justify-center rounded-full bg-white text-violet-700"><Play className="ml-0.5 size-4 fill-current" /></span>Explore learning</button>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 text-sm text-slate-300"><span className="inline-flex items-center gap-2"><ShieldCheck className="size-5 text-emerald-400" /> Verified experts</span><span className="inline-flex items-center gap-2"><UsersRound className="size-5 text-sky-400" /> Live community</span></div>
          </div>
          <div className="landing-scene absolute right-[-90px] top-1/2 hidden aspect-square w-[520px] -translate-y-1/2 lg:block xl:right-[3%] xl:w-[580px]" aria-hidden="true"><div className="landing-platform" /><div className="landing-cube landing-cube-main"><span>E</span></div><div className="landing-cube landing-cube-small landing-cube-one"><span>01</span></div><div className="landing-cube landing-cube-small landing-cube-two"><span>AI</span></div><div className="landing-cube landing-cube-small landing-cube-three"><span>∞</span></div><div className="landing-ring landing-ring-a" /><div className="landing-ring landing-ring-b" /></div>
        </div>
        <div className="landing-metrics absolute bottom-0 left-0 right-0 z-20 grid grid-cols-3 border-t border-white/10 bg-slate-950/45 backdrop-blur-xl"><div><strong>{loading ? "—" : teacherCount}</strong><span>Featured teachers</span></div><div><strong>{loading ? "—" : courseCount}</strong><span>Published courses</span></div><div><strong>{loading ? "—" : `${averageRating}/5`}</strong><span>Featured rating</span></div></div>
      </section>
      <Categorycard />
      <SpecialisedChildren />
      {loading ? <section className="mx-auto mt-12 rounded-3xl border border-white/10 bg-[#18181b] py-16 text-center text-sm text-slate-400">Loading teachers...</section> : teachers.length ? <Teacherscard teachers={teachers} /> : <section className="mx-auto mt-12 rounded-3xl border border-white/10 bg-[#18181b] py-16 text-center text-sm text-slate-400">No verified teachers are available right now.</section>}
      <Footer />
    </div>
  );
}

export default Home;
