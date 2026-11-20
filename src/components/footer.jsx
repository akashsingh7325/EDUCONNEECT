import { GraduationCap } from "lucide-react";


function Footer() {
    return (
        <div className="mt-16">
            <section className="card-3d scene-3d overflow-hidden rounded-3xl border border-white/10 bg-slate-950 px-6 py-10 text-slate-300 sm:px-10 lg:px-12">
                <article className="border-b border-white/10 pb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-bold tracking-wide !text-white">
                        <GraduationCap className="size-20 text-amber-400" />
                        EDUCONNECT
                    </h1>
                    <h3 className="mt-3 text-sm font-semibold uppercase tracking-widest text-sky-300">
                        Connect Learn Grow
                    </h3>

                    <p className="mt-3 max-w-md leading-relaxed text-slate-400">
                        Achieve what you once only dreamed of.
                    </p>
                </article>

                {/* links to pages footer */}
                <article className="grid gap-8 py-8 sm:grid-cols-2">
                    <div>
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
                            ---quick links---
                        </h3>
                        <div className="flex flex-col items-start gap-3">
                            <a className="transition-colors hover:text-amber-300" href="/">Home</a>
                            <a className="transition-colors hover:text-amber-300" href="/masters">explore masters</a>
                            <a className="transition-colors hover:text-amber-300" href="/community">students community</a>
                            <a className="transition-colors hover:text-amber-300" href="/profile">view your profile</a>
                        </div>
                    </div>
                   
                    <div>
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
                            ---featured links---
                        </h3>
                        <div className="flex flex-col items-start gap-3">
                            <a className="transition-colors hover:text-amber-300" href="/libarey">explore libary</a>
                            <a className="transition-colors hover:text-amber-300" href="/onlinecource">learn online</a>
                            <a className="transition-colors hover:text-amber-300" href="/edubot">ask edubot</a>
                        </div>
                    </div>
                </article>
                <article className="flex gap-5">
                    <a
                        className="inline-flex items-center gap-2 transition-colors hover:text-amber-300"
                        href="https://www.instagram.com/"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Visit Instagram"
                    >
                        Instagram
                    </a>
                    <a
                        className="inline-flex items-center gap-2 transition-colors hover:text-amber-300"
                        href="https://www.linkedin.com/"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Visit LinkedIn"
                    >
                        LinkedIn
                    </a>
                </article>

                <article className="border-t border-white/10 pt-6 text-sm text-slate-400">
                    <p>Thanks for visiting EduConnect.</p>
                    
                </article>
            </section>
        </div>
    );
}

export default Footer;