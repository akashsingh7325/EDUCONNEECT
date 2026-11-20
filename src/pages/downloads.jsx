import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Eye, FileText, Filter, Library, Search, Trash2 } from "lucide-react";
import { getMaterials, getMyNotes, saveMaterialToHub, removeMaterialFromHub } from "../services/phase4";
import { getStudentId, getStudentNotes, removeStudentNote, saveStudentNote } from "../utils/notesHub";

const fallbackTeacherNotes = [
  { id: "teacher-math-10", title: "Complete Mathematics Formula Booklet", subject: "Mathematics", source: "Rahul Sharma", sourceType: "Teacher", course: "Complete Mathematics for Class 10", pages: 28, size: "4.2 MB", file: "/pdfs/educonnect-material.pdf" },
  { id: "course-science-12", title: "Science Revision & Experiment Notes", subject: "Science", source: "Priya Singh", sourceType: "Course", course: "Science Fundamentals and Experiments", pages: 36, size: "6.8 MB", file: "/pdfs/educonnect-material.pdf" },
  { id: "teacher-python", title: "Python Functions and Modules", subject: "Programming", source: "Amit Verma", sourceType: "Teacher", course: "Python Programming Masterclass", pages: 18, size: "3.6 MB", file: "/pdfs/educonnect-material.pdf" },
  { id: "course-english", title: "English Communication Practice Notes", subject: "English", source: "Neha Kapoor", sourceType: "Course", course: "English Communication Skills", pages: 42, size: "5.1 MB", file: "/pdfs/educonnect-material.pdf" },
];

function Downloads() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");
  const [tab, setTab] = useState("available");
  const [teacherNotes, setTeacherNotes] = useState(fallbackTeacherNotes);
  const [hubNotes, setHubNotes] = useState(() => getStudentNotes());
  const [preview, setPreview] = useState(null);
  const studentId = getStudentId();

  useEffect(() => {
    getMaterials({ type: "NOTES" }).then((body) => {
      const backendNotes = body?.data?.materials || [];
      if (backendNotes.length) setTeacherNotes(backendNotes.map((m) => ({ id: m.id, title: m.title, subject: m.subject, source: m.sourceName, sourceType: m.sourceType === "COURSE" ? "Course" : "Teacher", course: m.courseName || "", pages: m.pages || 0, size: m.fileSize || "", file: m.fileUrl })));
    }).catch(() => {});
    getMyNotes().then((body) => {
      const notes = body?.data?.materials || [];
      if (notes.length) setHubNotes(notes.map((m) => ({ id: m.id, title: m.title, subject: m.subject, source: m.sourceName, sourceType: m.sourceType === "COURSE" ? "Course" : "Teacher", course: m.courseName || "", pages: m.pages || 0, size: m.fileSize || "", file: m.fileUrl })));
    }).catch(() => {});
    const refresh = () => setHubNotes(getStudentNotes());
    window.addEventListener("educonnect-notes-updated", refresh);
    return () => window.removeEventListener("educonnect-notes-updated", refresh);
  }, []);

  const filtered = useMemo(() => teacherNotes.filter((item) => {
    const text = `${item.title} ${item.subject} ${item.source} ${item.course}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (subject === "All" || item.subject === subject);
  }), [query, subject]);

  const hubFiltered = useMemo(() => hubNotes.filter((item) => {
    const text = `${item.title} ${item.subject} ${item.source} ${item.course}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (subject === "All" || item.subject === subject);
  }), [hubNotes, query, subject]);

  const saveNote = (note) => { setHubNotes(saveStudentNote(note)); saveMaterialToHub(note.id).catch(() => {}); };
  const removeNote = (noteId) => { setHubNotes(removeStudentNote(noteId)); removeMaterialFromHub(noteId).catch(() => {}); };
  const savedIds = new Set(hubNotes.map((item) => String(item.id)));

  const cards = tab === "available" ? filtered : hubFiltered;

  return (
    <div className="w-full px-3 py-5 sm:px-5 sm:py-8 lg:px-8">
      <section className="card-3d scene-3d mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[#18181b]">
        <header className="border-b border-white/10 bg-gradient-to-r from-violet-950/70 via-[#18181b] to-sky-950/40 px-5 py-7 text-left sm:px-8 sm:py-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">EduConnect Notes Hub</p><h1 className="m-0 text-3xl font-bold tracking-tight text-white sm:text-4xl">Notes Library</h1><p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">Notes are kept privately in your EduConnect account. Nothing is downloaded to your browser.</p></div>
            <div className="rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-200">Student ID: {studentId}</div>
          </div>
        </header>
        <div className="p-5 sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex rounded-xl border border-white/10 bg-[#09090b] p-1"><button type="button" onClick={() => setTab("available")} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold ${tab === "available" ? "bg-violet-700 text-white" : "text-slate-400"}`}><BookOpen className="size-4" />Teacher notes</button><button type="button" onClick={() => setTab("hub")} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold ${tab === "hub" ? "bg-violet-700 text-white" : "text-slate-400"}`}><Library className="size-4" />My Notes Hub <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{hubNotes.length}</span></button></div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#09090b] px-4 py-3 text-slate-400"><Search className="size-5" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes" className="min-w-0 flex-1 bg-transparent text-white outline-none" /></label>
              <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#09090b] px-4 py-3 text-slate-400"><Filter className="size-5" /><select value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-transparent text-white outline-none"><option>All</option><option>Mathematics</option><option>Science</option><option>Programming</option><option>English</option></select></label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((item) => {
              const saved = savedIds.has(String(item.id));
              return <article key={item.id} className="card-3d scene-3d rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left hover:border-violet-400/30"><div className="mb-5 flex items-start justify-between"><div className="flex size-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300"><FileText className="size-6" /></div><span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-300">{item.sourceType}</span></div><span className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.subject}</span><h2 className="mt-2 min-h-12 text-lg font-bold leading-snug text-white">{item.title}</h2><p className="mt-2 text-sm text-violet-300">{item.sourceType === "Course" ? `Course: ${item.course}` : `Teacher: ${item.source}`}</p><p className="mt-2 text-sm text-slate-500">{item.pages} pages · {item.size}</p><div className="mt-5 grid grid-cols-1 gap-2"><button type="button" onClick={() => setPreview(item)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/10"><Eye className="size-4" />Open in Notes Hub</button>{tab === "available" ? <button type="button" onClick={() => saveNote(item)} disabled={saved} className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${saved ? "cursor-default bg-emerald-500/10 text-emerald-300" : "bg-violet-700 text-white hover:bg-violet-600"}`}>{saved ? <><CheckCircle2 className="size-4" />Saved to my hub</> : <>Save to my notes hub</>}</button> : <button type="button" onClick={() => removeNote(item.id)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-500/20"><Trash2 className="size-4" />Remove from hub</button>}</div></article>;
            })}
          </div>
          {cards.length === 0 && <div className="rounded-2xl border border-white/10 py-12 text-center text-slate-400">{tab === "hub" ? "No notes saved yet. Save teacher or course notes to build your private Notes Hub." : "No matching teacher or course notes found."}</div>}
        </div>
      </section>
      {preview && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Notes preview"><div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#18181b]"><div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3"><div className="min-w-0"><p className="truncate font-bold text-white">{preview.title}</p><p className="text-xs text-slate-400">Private EduConnect Notes Hub</p></div><button type="button" onClick={() => setPreview(null)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white">Close</button></div><iframe title={preview.title} src={preview.file} className="min-h-0 flex-1 bg-white" /></div></div>}
    </div>
  );
}
export default Downloads;
