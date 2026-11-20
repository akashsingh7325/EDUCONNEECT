import { useState } from "react";
import { Atom, Bot, Calculator, FlaskConical, Languages, Send, Sparkles } from "lucide-react";

const quickPrompts = [
  { label: "Explain a topic", icon: Sparkles, prompt: "Explain a difficult topic in simple steps" },
  { label: "Solve maths", icon: Calculator, prompt: "Help me solve this maths problem" },
  { label: "Science quiz", icon: FlaskConical, prompt: "Start a fun science quiz for me" },
  { label: "Improve English", icon: Languages, prompt: "Help me improve my English writing" },
];

function Edubot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi, learner! 👋 I’m EduBot. Ask me anything, or choose a quick activity below." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (text = input) => {
    const question = text.trim();
    if (!question) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: question },
      { role: "bot", text: `Let’s learn this together! I’ll break “${question}” into simple, easy steps and give you a quick practice question.` },
    ]);
    setInput("");
  };

  return (
    <main className="mx-auto w-full px-3 py-5 sm:px-5 sm:py-8 lg:px-8">
      <section className="hero-3d scene-3d grid min-h-[680px] overflow-hidden rounded-[28px] border border-white/10 lg:grid-cols-[290px_1fr]">
        <aside className="border-b border-white/10 bg-slate-950/45 p-5 text-left sm:p-7 lg:border-b-0 lg:border-r">
          <div className="avatar-3d flex size-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-600 to-cyan-400 text-white">
            <Bot className="size-8" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Your AI study buddy</p>
          <h1 className="mb-0 mt-2 text-4xl font-black tracking-tight text-white">EduBot</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">Friendly help for homework, quizzes, concepts, and confidence.</p>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.08] p-3">
            <span className="relative flex size-3"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-3 rounded-full bg-emerald-400" /></span>
            <div><p className="text-sm font-bold text-emerald-300">Ready to help</p><p className="text-xs text-slate-500">24/7 learning support</p></div>
          </div>

          <div className="mt-6 hidden space-y-2 lg:block">
            {["Simple explanations", "Step-by-step answers", "Practice quizzes"].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-slate-300"><Atom className="size-4 text-violet-300" />{feature}</div>
            ))}
          </div>
        </aside>

        <div className="flex min-h-[520px] flex-col text-left">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-300">Learning room</p><h2 className="mb-0 mt-1 text-xl font-bold text-white">Ask EduBot</h2></div><span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-200">Student mode</span></header>

          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "bot" && <span className="mr-3 flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white"><Bot className="size-5" /></span>}
                  <article className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-xl sm:px-5 sm:py-4 ${message.role === "user" ? "rounded-br-md bg-violet-700 text-white shadow-xl shadow-violet-950/30" : "rounded-tl-md border border-white/10 bg-white/[0.06] text-slate-200"}`}>
                    {message.text}
                  </article>
                </div>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {quickPrompts.map(({ label, icon: Icon, prompt }) => (
                <button key={label} type="button" onClick={() => sendMessage(prompt)} className="card-3d flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-bold text-slate-200 hover:border-violet-400/30 hover:bg-violet-500/[0.08]">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Icon className="size-5" /></span>{label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="border-t border-white/10 p-4 sm:p-6">
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-2 shadow-xl focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10">
              <Sparkles className="size-5 shrink-0 text-violet-300" />
              <input value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500" placeholder="Ask anything you’re learning..." />
              <button type="submit" aria-label="Send message" className="button-3d flex size-11 shrink-0 items-center justify-center rounded-xl border-violet-900 bg-violet-700 text-white"><Send className="size-5" /></button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Edubot;