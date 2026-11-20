import { useEffect, useMemo, useState } from "react";
import { getMaterials, getMyNotes, saveMaterialToHub } from "../services/phase4";
import { BookOpen, CheckCircle2, ClipboardCheck, Eye, Library, Search } from "lucide-react";
import { getStudentNotes, saveStudentNote } from "../utils/notesHub";

const fallbackMaterials = [
  { id: "dpp-calculus-1", type: "DPP", title: "Calculus Daily Practice Set 1", subject: "Mathematics", questions: 20, date: "Today", sourceType: "Teacher", source: "Rahul Sharma", course: "Complete Mathematics for Class 10", file: "/pdfs/educonnect-material.pdf" },
  { id: "notes-newton", type: "Notes", title: "Newton's Laws — Class Notes", subject: "Science", pages: 12, date: "Yesterday", sourceType: "Teacher", source: "Priya Singh", course: "Science Fundamentals and Experiments", file: "/pdfs/educonnect-material.pdf" },
  { id: "dpp-quadratic", type: "DPP", title: "Quadratic Equations Practice", subject: "Mathematics", questions: 25, date: "Oct 24", sourceType: "Course", source: "Rahul Sharma", course: "Complete Mathematics for Class 10", file: "/pdfs/educonnect-material.pdf" },
  { id: "notes-python", type: "Notes", title: "Python Functions and Modules", subject: "Programming", pages: 18, date: "Oct 22", sourceType: "Course", source: "Amit Verma", course: "Python Programming Masterclass", file: "/pdfs/educonnect-material.pdf" },
  { id: "dpp-reading", type: "DPP", title: "Reading Comprehension Drill", subject: "English", questions: 15, date: "Oct 20", sourceType: "Teacher", source: "Neha Kapoor", course: "English Communication Skills", file: "/pdfs/educonnect-material.pdf" },
  { id: "notes-organic", type: "Notes", title: "Organic Chemistry Short Notes", subject: "Science", pages: 16, date: "Oct 18", sourceType: "Course", source: "Priya Singh", course: "Science Fundamentals and Experiments", file: "/pdfs/educonnect-material.pdf" },
];

function Dpps() {
  const [materials, setMaterials] = useState(fallbackMaterials);
  const [activeType, setActiveType] = useState("All");
  const [query, setQuery] = useState("");
  const [savedNotes, setSavedNotes] = useState(() => getStudentNotes());
  const [preview, setPreview] = useState(null);
  const savedIds = new Set(savedNotes.map((item) => String(item.id)));

  useEffect(() => {
    getMaterials().then((body) => {
      const backendMaterials = body?.data?.materials || [];
      if (backendMaterials.length) setMaterials(backendMaterials.map((m) => ({ id: m.id, type: m.type === "NOTES" ? "Notes" : "DPP", title: m.title, subject: m.subject, questions: m.questions || 0, pages: m.pages || 0, date: new Date(m.createdAt).toLocaleDateString(), sourceType: m.sourceType === "COURSE" ? "Course" : "Teacher", source: m.sourceName, course: m.courseName || "", file: m.fileUrl })));
    }).catch(() => {});
    getMyNotes().then((body) => {
      const notes = body?.data?.materials || [];
      if (notes.length) setSavedNotes(notes.map((m) => ({ id: m.id, title: m.title, subject: m.subject })));
    }).catch(() => {});
  }, []);

  const filteredMaterials = useMemo(() => materials.filter((item) => {
    const matchesType = activeType === "All" || item.type === activeType;
    const matchesQuery = `${item.title} ${item.subject}`.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  }), [activeType, query, materials]);

  const saveToHub = (item) => { setSavedNotes(saveStudentNote(item)); saveMaterialToHub(item.id).catch(() => {}); };

  return <div className="w-full px-3 py-5 sm:px-5 sm:py-8 lg:px-8">
    <section className="card-3d scene-3d overflow-hidden rounded-3xl border border-white/10 bg-[#18181b]">
      <header className="border-b border-white/10 bg-gradient-to-r from-sky-950/50 via-[#18181b] to-violet-950/70 px-5 py-7 text-left sm:px-8 sm:py-9"><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-300">Practice & revision</p><h1 className="m-0 text-3xl font-bold tracking-tight text-white sm:text-4xl">DPPs & Notes</h1><p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">Teacher and course materials are saved privately in your EduConnect Notes Hub.</p></header>
      <div className="p-5 text-left sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex rounded-xl border border-white/10 bg-[#09090b] p-1">{["All", "DPP", "Notes"].map((type) => <button key={type} type="button" onClick={() => setActiveType(type)} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${activeType === type ? "bg-violet-700 text-white" : "text-slate-400 hover:text-white"}`}>{type === "DPP" ? "DPPs" : type}</button>)}</div><label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-slate-400 sm:min-w-72"><Search className="size-5" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search materials" className="min-w-0 flex-1 bg-transparent text-white outline-none" /></label></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredMaterials.map((item) => { const saved = savedIds.has(String(item.id)); return <article key={item.id} className="card-3d scene-3d rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-sky-400/30"><div className="flex items-start justify-between gap-3"><div className={`flex size-12 items-center justify-center rounded-2xl ${item.type === "DPP" ? "bg-violet-500/15 text-violet-300" : "bg-sky-500/15 text-sky-300"}`}>{item.type === "DPP" ? <ClipboardCheck className="size-6" /> : <BookOpen className="size-6" />}</div><span className="text-xs font-medium text-slate-500">{item.date}</span></div><p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{item.subject} · {item.type} · {item.sourceType}</p><h2 className="m-0 mt-2 min-h-12 text-lg font-bold leading-snug text-white">{item.title}</h2><p className="mt-2 text-sm text-violet-300">{item.sourceType === "Course" ? item.course : item.source}</p><p className="mt-2 text-sm text-slate-500">{item.type === "DPP" ? `${item.questions} questions` : `${item.pages} pages`} · PDF</p><div className="mt-5 grid grid-cols-1 gap-2"><button type="button" onClick={() => setPreview(item)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-violet-500/15"><Eye className="size-4" />Open in Notes Hub</button><button type="button" onClick={() => saveToHub(item)} disabled={saved} className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${saved ? "bg-emerald-500/10 text-emerald-300" : "bg-violet-700 text-white hover:bg-violet-600"}`}>{saved ? <><CheckCircle2 className="size-4" />Saved to my hub</> : <><Library className="size-4" />Save to my notes hub</>}</button></div></article>})}</div>
        {filteredMaterials.length === 0 && <p className="rounded-2xl border border-white/10 py-12 text-center text-slate-400">No matching materials found.</p>}
      </div>
    </section>
    {preview && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#18181b]"><div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3"><div><p className="font-bold text-white">{preview.title}</p><p className="text-xs text-slate-400">Private EduConnect Notes Hub</p></div><button type="button" onClick={() => setPreview(null)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white">Close</button></div><iframe title={preview.title} src={preview.file} className="min-h-0 flex-1 bg-white" /></div></div>}
  </div>;
}
export default Dpps;
