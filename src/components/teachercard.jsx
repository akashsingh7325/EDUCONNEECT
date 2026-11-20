import { ArrowRight, BadgeCheck, Clock3, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

function Teacherscard({ teachers = [] }) {
  return (
    <section className="mx-auto mt-12 w-full" aria-labelledby="featured-teacher-title">
      <div className="mb-6 flex flex-col gap-2 text-left sm:flex-row sm:items-end sm:justify-between text-slate-100">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
            Learn from the best
          </p>
          <h2
            id="featured-teacher-title"
            className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            Meet your next mentor
          </h2>
          <p className="text-sm text-slate-400 sm:text-base">
            Patient, experienced teachers who make every lesson count.
          </p>
        </div>
        <Link
          to="/masters"
          className="inline-flex items-center gap-2 self-start text-sm font-semibold text-violet-700 transition hover:text-violet-900 sm:self-auto"
        >
          Explore all teachers <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teachers.map((teacher) => {
          const {
            id,
            name,
            subject,
            experience,
            location,
            rating,
            monthlyFee,
            reviewCount = 120,
          } = teacher;
          const price = monthlyFee
            ? `₹${Number(monthlyFee).toLocaleString("en-IN")}`
            : "Contact for price";
          const experienceLabel = experience
            ? `${experience} years experience`
            : "Experienced educator";
          const initials = name
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase();

          return (
            <article
              key={id}
              className="card-3d scene-3d overflow-hidden rounded-3xl border border-white/10 bg-[#18181b] text-left hover:border-violet-400/30"
            >
              <div className="relative flex min-h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-violet-100 via-indigo-100 to-sky-100">
                <div
                  aria-hidden="true"
                  className="absolute -left-10 -top-12 size-44 rounded-full bg-white/50 blur-2xl"
                />
                <div className="avatar-3d relative flex size-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-violet-600 to-indigo-700 text-4xl font-bold text-white">
                  {initials}
                </div>
              </div>

              <div className="flex min-h-72 flex-col justify-between gap-7 p-5 sm:p-6">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
                      Featured teacher
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                      <BadgeCheck className="size-4 text-violet-600" />
                      Verified educator
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3                     className="text-xl font-bold tracking-tight text-white">
                      {name}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-bold text-amber-700">
                      <Star className="size-4 fill-amber-400 text-amber-400" />
                      {rating}
                    </span>
                  </div>
                  <p className="mt-1 text-base font-medium text-violet-700">{subject}</p>

                  <div className="mt-5 flex flex-col gap-y-2 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-4 text-slate-400" />
                      {experienceLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4 text-slate-400" />
                      {location}
                    </span>
                    <span>{reviewCount} student reviews</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-white/10 pt-5">
                  <p className="text-sm text-slate-400">
                    Starting at{" "}
                    <span className="text-xl font-bold text-white">{price}</span>
                    <span> / month</span>
                  </p>
                  <Link
                    to="/masters"
                    className="button-3d inline-flex items-center justify-center gap-2 rounded-xl border-violet-900 bg-violet-700 px-5 py-3 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
                  >
                    View teacher <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Teacherscard;
