import { MessageCircle, Send, UsersRound } from "lucide-react";

function Com() {
    return (
        <main className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
            <section className="hero-3d scene-3d overflow-hidden rounded-[2rem] border border-white/10 px-5 py-7 text-left sm:p-8">
                <header className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Student space</p><h1 className="mb-0 mt-2 text-3xl font-black text-white">Community</h1></div><span className="flex size-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300"><UsersRound /></span></header>
                <div className="grid gap-4 py-6 md:grid-cols-[1fr_260px]">
                    {[1,2,3].map((item) => <article key={item} className="card-3d rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className="mb-4 flex items-center gap-3"><span className="avatar-3d flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-700 text-sm font-black text-white">S{item}</span><div><h2 className="m-0 text-base text-white">Study Group {item}</h2><p className="mt-1 text-xs text-slate-400">24 learners active</p></div></div><p className="text-sm leading-relaxed text-slate-300"><MessageCircle className="mr-2 inline size-4 text-violet-300" />Share questions, notes, and ideas with your learning circle.</p></article>)}</div>
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3"><input className="min-w-0 flex-1 bg-transparent py-2 text-white outline-none placeholder:text-slate-500" placeholder="Write a message..." /><button className="button-3d flex size-11 items-center justify-center rounded-xl border-violet-900 bg-violet-700 text-white"><Send className="size-5" /></button></label>
            </section>
        </main>
    );
}
export default Com;