import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../../services/auth";

export default function ProtectedAdminRoute() {
  const [state, setState] = useState({ loading: true, user: null });

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((user) => { if (active) setState({ loading: false, user }); })
      .catch(() => { if (active) setState({ loading: false, user: null }); });
    return () => { active = false; };
  }, []);

  if (state.loading) return <main className="grid min-h-screen place-items-center bg-slate-100 text-sm font-semibold text-slate-500">Verifying administrator access...</main>;
  if (!state.user || state.user.role !== "ADMIN") return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
