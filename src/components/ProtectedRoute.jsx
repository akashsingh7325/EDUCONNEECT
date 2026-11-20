import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

export default function ProtectedRoute({ allowedRoles, loginPath = "/", allowGuest = false }) {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, user: null });

  useEffect(() => {
    let active = true;
    if (allowGuest && !localStorage.getItem("educonnectAccessToken")) {
      setState({ loading: false, user: null });
      return () => { active = false; };
    }

    getCurrentUser()
      .then((user) => { if (active) setState({ loading: false, user }); })
      .catch(() => { if (active) setState({ loading: false, user: null }); });
    return () => { active = false; };
  }, [allowGuest]);

  if (state.loading) {
    return <main className="grid min-h-[40vh] place-items-center text-sm font-semibold text-slate-400">Verifying your session...</main>;
  }
  if (!state.user) {
    if (allowGuest) return <Outlet />;
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }
  if (allowedRoles && !allowedRoles.includes(state.user.role)) return <Navigate to={loginPath} replace />;
  return <Outlet />;
}
