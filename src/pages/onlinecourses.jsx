import { useEffect, useMemo, useState } from "react";
import { getCourses, getMyCourseEnrollments, enrollInCourse, cancelCourseEnrollment } from "../services/phase4";
import { Award, BookOpen, CheckCircle2, Clock3, Play, Search, Star, UsersRound } from "lucide-react";

function OnlineCourses() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getCourses(), getMyCourseEnrollments()])
      .then(([courseBody, enrollmentBody]) => {
        if (!active) return;
        const backendCourses = courseBody?.data?.courses || [];
        setCourses(backendCourses.map((course) => ({ ...course, teacher: course.instructorName || course.teacher?.fullName || "EduConnect Teacher", students: course.studentCount || 0, image: course.imageUrl || "" })));
        const ids = (enrollmentBody?.data?.enrollments || []).filter((item) => item.status !== "CANCELLED").map((item) => item.courseId);
        setEnrolled(ids);
      })
      .catch((requestError) => { if (active) setError(requestError?.message || "Could not load courses."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => courses.filter((course) => {
    const matchesCategory = category === "All" || course.category === category;
    const text = `${course.title} ${course.teacher} ${course.category}`.toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase());
  }), [category, query, courses]);

  const toggleEnrollment = async (courseId) => {
    const isEnrolled = enrolled.includes(courseId);
    const next = isEnrolled ? enrolled.filter((id) => id !== courseId) : [...enrolled, courseId];
    setEnrolled(next);
    try {
      if (isEnrolled) await cancelCourseEnrollment(courseId);
      else await enrollInCourse(courseId);
    } catch (requestError) {
      setEnrolled(enrolled);
      setError(requestError?.message || "The enrollment action could not be completed.");
    }
  };

  return (
    <main className="w-full px-3 py-5 sm:px-5 sm:py-8 lg:px-8">
      <section className="mx-auto max-w-7xl text-left">
        <div className="course-hero scene-3d relative overflow-hidden rounded-3xl border border-white/10 px-6 py-10 sm:px-10 lg:min-h-[300px] lg:flex lg:items-center">
          <div className="course-grid absolute inset-0" />
          <div className="course-glow course-glow-one" />
          <div className="course-glow course-glow-two" />
          <div className="relative z-10 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Learn on your schedule</p>
            <h1 className="m-0 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Online Courses</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">One-time workshops and complete certification courses taught by experienced EduConnect educators.</p>
          </div>
          <div className="course-orb absolute -right-16 -top-20 hidden size-72 rounded-full lg:block"><Play className="size-16 text-white" /></div>
        </div>

        <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#18181b] p-3 sm:flex-row">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#09090b] px-4">
            <Search className="size-5 text-violet-400" />
            <span className="sr-only">Search courses</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500" placeholder="Search courses or teachers" />
          </label>
          <select aria-label="Filter course category" value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-12 rounded-xl border border-white/10 bg-[#09090b] px-4 text-sm font-semibold text-white outline-none">
            {["All", "Mathematics", "Science", "Programming", "English", "Career"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        {loading && <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] py-14 text-center text-sm text-slate-400">Loading courses...</div>}
        {error && <div role="alert" className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">{error}</div>}

        {!loading && !error && <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => {
            const isEnrolled = enrolled.includes(course.id);
            return (
              <article key={course.id} className="course-card card-3d overflow-hidden rounded-3xl border border-white/10 bg-[#18181b]">
                <div className="relative h-52 overflow-hidden">
                  {course.image ? <img src={course.image} alt="" loading="lazy" className="course-photo size-full object-cover" /> : <div className="size-full bg-gradient-to-br from-violet-700 to-slate-950" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">{course.category}</span>
                  {course.certificate && <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950"><Award className="size-4" /> Certificate</span>}
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                    <span>{course.level}</span><span className="inline-flex items-center gap-1 text-amber-300"><Star className="size-4 fill-current" /> {course.rating}</span>
                  </div>
                  <h2 className="mt-3 min-h-14 text-xl font-bold leading-tight text-white">{course.title}</h2>
                  <p className="mt-2 text-sm text-violet-300">by {course.teacher}</p>
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4" /> {course.duration}</span>
                    <span className="inline-flex items-center gap-1.5"><UsersRound className="size-4" /> {Number(course.students || 0).toLocaleString()} learners</span>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                    <strong className="text-lg text-white">{course.price ? `₹${Number(course.price).toLocaleString("en-IN")}` : "Free"}</strong>
                    <button type="button" onClick={() => toggleEnrollment(course.id)} className={`button-3d inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${isEnrolled ? "border border-emerald-400/30 bg-emerald-500/15 text-emerald-300" : "border-violet-900 bg-violet-700 text-white"}`}>
                      {isEnrolled ? <><CheckCircle2 className="size-4" /> Enrolled</> : <><BookOpen className="size-4" /> Enroll now</>}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>}

        {!loading && !error && filtered.length === 0 && <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] py-14 text-center"><BookOpen className="mx-auto size-10 text-violet-400" /><p className="mt-3 font-semibold text-white">No courses found</p><p className="mt-1 text-sm text-slate-400">Try another search or category.</p></div>}
      </section>
    </main>
  );
}

export default OnlineCourses;
