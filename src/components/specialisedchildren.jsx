import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function SpecialisedChildren() {
  return (
    <section
      aria-labelledby="learning-support-title"
      className="card-3d scene-3d relative isolate mx-auto mt-8 w-full overflow-hidden rounded-3xl border border-white/10 bg-[#102f46] text-left sm:mt-10"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_72%_60%,rgba(72,120,142,0.45),transparent_42%),linear-gradient(110deg,#102f46_0%,#123650_58%,#244d61_100%)]"
      />
      <div aria-hidden="true" className="learning-sculpture absolute bottom-4 right-4 -z-10 hidden size-[310px] items-center justify-center lg:flex">
        <div className="learning-orbit learning-orbit-one" />
        <div className="learning-orbit learning-orbit-two" />
        <div className="learning-block learning-block-a"><span>ABC</span></div>
        <div className="learning-block learning-block-b"><span>123</span></div>
        <div className="learning-block learning-block-c"><span>&lt;/&gt;</span></div>
        <div className="learning-core"><ArrowRight className="size-12" /></div>
        <div className="learning-spark learning-spark-one" />
        <div className="learning-spark learning-spark-two" />
        <div className="learning-spark learning-spark-three" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#102f46] via-[#102f46]/85 to-[#102f46]/20 sm:bg-gradient-to-r sm:from-[#102f46] sm:via-[#102f46]/95 sm:via-50% sm:to-transparent"
      />

      <div className="relative flex min-h-[470px] items-center px-6 py-10 sm:min-h-[440px] sm:px-9 sm:py-12 lg:min-h-[450px] lg:px-12">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-sky-100 backdrop-blur-sm sm:text-sm">
            Learning for everyone
          </p>
          <h2
            id="learning-support-title"
            className="mb-5 max-w-3xl text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Every mind learns differently.
            <br className="hidden sm:block" /> Every mind deserves support.
          </h2>
          <p className="mb-7 max-w-xl text-base leading-relaxed text-sky-100/90 sm:text-lg lg:text-xl">
            Discover educators and learning support that help every learner
            move forward with confidence.
          </p>
          <Link
            to="/masters"
            className="button-3d inline-flex items-center gap-3 rounded-xl border-amber-500 bg-amber-400 px-5 py-3.5 text-base font-bold text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 sm:px-6 sm:py-4 sm:text-lg"
          >
            Explore Support <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SpecialisedChildren;
