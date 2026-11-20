import { useEffect, useState } from "react";
import { ArrowUpDown, Search, UserRound, X } from "lucide-react";
import { getAdminUser, getAdminUsers, updateAdminUserStatus } from "../services/adminApi";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionTarget, setActionTarget] = useState(null);
  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = async (targetPage = page) => {
    setLoading(true);
    setError("");
    try {
      const body = await getAdminUsers({ search, role, status, page: targetPage, limit: 20, sortBy, sortOrder });
      setUsers(body.data.users || []);
      setPagination(body.data.pagination || { total: 0, pages: 1 });
      setPage(targetPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, [role, status, sortBy, sortOrder]);

  const setSort = (field) => {
    if (sortBy === field) setSortOrder((current) => current === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortOrder("asc"); }
  };

  const openDetail = async (user) => {
    setDetailLoading(true);
    setDetail(null);
    try {
      const body = await getAdminUser(user.id);
      setDetail(body.data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const confirmAction = async () => {
    if (!actionTarget) return;
    const nextStatus = actionTarget.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    setActionLoading(true);
    setError("");
    try {
      await updateAdminUserStatus(actionTarget.id, nextStatus, actionReason);
      setActionTarget(null);
      setActionReason("");
      await load(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-5 text-left">
      <div><p className="text-sm font-bold text-indigo-600">Administration</p><h1 className="m-0 mt-1 text-3xl font-black text-slate-950">User management</h1></div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
        {["STUDENT", "TEACHER", "ADMIN"].map((value) => (
          <button key={value} onClick={() => setRole(value === role ? "" : value)} className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold ${role === value ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
            {value === "STUDENT" ? "Students" : value === "TEACHER" ? "Teachers" : "Admins"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3"><Search className="size-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load(1)} placeholder="Search name, email, username or user ID" className="min-w-0 flex-1 py-2.5 text-sm outline-none" /></label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="">All statuses</option><option>ACTIVE</option><option>SUSPENDED</option><option>INACTIVE</option><option>PENDING_VERIFICATION</option></select>
        <button onClick={() => load(1)} className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white">Search</button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>
            <th className="px-5 py-4"><button onClick={() => setSort("fullName")} className="flex items-center gap-1">User <ArrowUpDown className="size-3" /></button></th>
            <th className="px-5 py-4"><button onClick={() => setSort("role")} className="flex items-center gap-1">Role <ArrowUpDown className="size-3" /></button></th>
            <th className="px-5 py-4"><button onClick={() => setSort("status")} className="flex items-center gap-1">Status <ArrowUpDown className="size-3" /></button></th>
            <th className="px-5 py-4"><button onClick={() => setSort("createdAt")} className="flex items-center gap-1">Registered <ArrowUpDown className="size-3" /></button></th>
            <th className="px-5 py-4">Action</th>
          </tr></thead>
          <tbody>{loading ? <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-400">Loading users...</td></tr> : users.map((user) => (
            <tr key={user.id} className="border-b border-slate-100 last:border-0">
              <td className="px-5 py-4"><button onClick={() => openDetail(user)} className="text-left"><p className="font-bold text-slate-900 hover:text-indigo-600">{user.fullName || "Unnamed user"}</p><p className="mt-1 text-xs text-slate-500">{user.email}</p></button></td>
              <td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{user.role}</span></td>
              <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${user.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : user.status === "SUSPENDED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{user.status}</span></td>
              <td className="px-5 py-4 text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="px-5 py-4">{user.role === "ADMIN" ? <span className="text-xs text-slate-400">Protected</span> : <button onClick={() => { setActionTarget(user); setActionReason(""); }} className={`rounded-lg border px-3 py-2 text-xs font-bold ${user.status === "SUSPENDED" ? "border-emerald-200 text-emerald-700" : "border-red-200 text-red-700"}`}>{user.status === "SUSPENDED" ? "Reactivate" : "Suspend"}</button>}</td>
            </tr>
          ))}</tbody>
        </table>
        {!loading && !users.length && <p className="py-10 text-center text-sm text-slate-400">No users found.</p>}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm"><span className="text-slate-500">{pagination.total} users</span><div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => load(page - 1)} className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40">Previous</button><span className="px-3 py-2">{page} / {pagination.pages || 1}</span><button disabled={page >= pagination.pages || loading} onClick={() => load(page + 1)} className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40">Next</button></div></div>
      </div>

      {detailLoading && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/20"><div className="rounded-xl bg-white px-6 py-4 text-sm">Loading user details...</div></div>}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/30" onClick={() => setDetail(null)}><div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="mb-6 flex items-start justify-between"><div className="flex items-center gap-3"><div className="grid size-12 place-items-center rounded-full bg-indigo-50"><UserRound className="size-6 text-indigo-600" /></div><div><h2 className="m-0 text-xl font-black text-slate-950">{detail.fullName}</h2><p className="mt-1 text-sm text-slate-500">{detail.role}</p></div></div><button onClick={() => setDetail(null)} className="rounded-lg p-2 hover:bg-slate-100"><X className="size-5" /></button></div>
          <dl className="space-y-4 text-sm"><div><dt className="text-xs font-bold uppercase text-slate-400">User ID</dt><dd className="mt-1 break-all">{detail.id}</dd></div><div><dt className="text-xs font-bold uppercase text-slate-400">Email</dt><dd className="mt-1">{detail.email}</dd></div><div><dt className="text-xs font-bold uppercase text-slate-400">Username</dt><dd className="mt-1">{detail.username || "—"}</dd></div><div><dt className="text-xs font-bold uppercase text-slate-400">Phone</dt><dd className="mt-1">{detail.phone || "—"}</dd></div><div><dt className="text-xs font-bold uppercase text-slate-400">Status and verification</dt><dd className="mt-1">{detail.status} · {detail.isEmailVerified ? "Email verified" : "Email not verified"}</dd></div><div><dt className="text-xs font-bold uppercase text-slate-400">Registered</dt><dd className="mt-1">{new Date(detail.createdAt).toLocaleString()}</dd></div><div><dt className="text-xs font-bold uppercase text-slate-400">Activity</dt><dd className="mt-1">{detail._count?.enrollments || 0} enrollments · {detail._count?.admissionsMade || 0} admissions · {detail._count?.dppAttempts || 0} DPP attempts</dd></div></dl>
        </div></div>
      )}

      {actionTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><h2 className="m-0 text-xl font-black text-slate-950">{actionTarget.status === "SUSPENDED" ? "Reactivate user" : "Suspend user"}</h2><p className="mt-2 text-sm text-slate-600">{actionTarget.fullName} ({actionTarget.email})</p>{actionTarget.status !== "SUSPENDED" && <textarea value={actionReason} onChange={(e) => setActionReason(e.target.value)} placeholder="Reason for suspension (required)" rows="3" className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400" />}<div className="mt-5 flex justify-end gap-3"><button disabled={actionLoading} onClick={() => setActionTarget(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold">Cancel</button><button disabled={actionLoading || (actionTarget.status !== "SUSPENDED" && !actionReason.trim())} onClick={confirmAction} className={`rounded-xl px-4 py-2 text-sm font-bold text-white ${actionTarget.status === "SUSPENDED" ? "bg-emerald-600" : "bg-red-600"}`}>{actionLoading ? "Saving..." : actionTarget.status === "SUSPENDED" ? "Reactivate" : "Suspend"}</button></div></div></div>
      )}
    </div>
  );
}
