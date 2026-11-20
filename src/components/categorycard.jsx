import { ArrowUpRight, Atom, BookOpen, BookOpenText, Braces, Sigma } from "lucide-react";
import { Link } from "react-router-dom";

const subjects = [
  { name: "English", description: "Build confidence in reading, writing, and speaking.", icon: BookOpenText, tone: "from-rose-500/25 to-orange-400/10", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85" },
  { name: "Python", description: "Turn your ideas into code, one project at a time.", icon: Braces, tone: "from-violet-500/30 to-sky-400/10", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=85" },
  { name: "Mathematics", description: "Make problem-solving clear, practical, and rewarding.", icon: Sigma, tone: "from-amber-400/25 to-rose-400/10", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=85" },
  { name: "Science", description: "Explore how the world works through science.", icon: Atom, tone: "from-emerald-400/25 to-cyan-400/10", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=85" },
];

function Categorycard() {
  return (
    <section
      aria-labelledby="subject-categories-title"
      className="mx-auto mt-12 w-full"
    >
      <div className="mb-6 text-left">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
          Find your focus
        </p>
        <h2
          id="subject-categories-title"
          className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
        >
          Explore subjects
        </h2>
        <p className="text-sm text-slate-400 sm:text-base">
          Choose a subject to find a teacher who fits the way you learn.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {subjects.map((subject) => {
          const SubjectIcon = subject.icon;
          return (
          <Link
            key={subject.name}
            to="/masters"
            aria-label={`Find ${subject.name} teachers`}
            className="card-3d scene-3d group relative isolate flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-slate-900 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
          >
            <img src={subject.image} alt="" loading="lazy" className="subject-photo absolute inset-0 -z-30 size-full object-cover" />
            <div aria-hidden="true" className={`absolute inset-0 -z-20 bg-gradient-to-br ${subject.tone}`} />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/35 to-slate-950/10" />
            <div aria-hidden="true" className="subject-grid absolute inset-0 -z-10 opacity-30" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/95 to-transparent" />
            <div className="subject-icon-3d absolute left-1/2 top-10 flex size-28 -translate-x-1/2 items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 text-white backdrop-blur-md">
              <SubjectIcon className="size-14" strokeWidth={1.5} />
            </div>

            <div className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-white backdrop-blur-sm transition group-hover:bg-white group-hover:text-violet-700">
              <ArrowUpRight className="size-5" />
            </div>

            <div className="card-content-3d p-5">
              <span className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                <BookOpen className="size-4" />
              </span>
              <h3 className="text-xl font-bold text-white">{subject.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/80">
                {subject.description}
              </p>
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Categorycard;
