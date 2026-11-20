import { useEffect, useState } from "react";
import { getAdminRolesStatus } from "../services/adminApi";

export default function AdminRoles() {
  const [data,setData]=useState(null); const [error,setError]=useState("");
  useEffect(()=>{getAdminRolesStatus().then((body)=>setData(body.data)).catch((err)=>setError(err.message));},[]);
  if(error)return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>;
  if(!data)return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">Loading role status...</div>;
  return <div className="space-y-6 text-left"><div><p className="text-sm font-bold text-indigo-600">Security</p><h1 className="m-0 mt-1 text-3xl font-black text-slate-950">Admin roles and permissions</h1></div><section className="rounded-2xl border border-slate-200 bg-white p-6"><div className="grid gap-4 sm:grid-cols-3"><article><p className="text-sm text-slate-500">Built-in role</p><p className="mt-1 text-xl font-black">{data.builtInRole}</p></article><article><p className="text-sm text-slate-500">Administrators</p><p className="mt-1 text-xl font-black">{data.adminCount}</p></article><article><p className="text-sm text-slate-500">Custom permission model</p><p className="mt-1 text-xl font-black">{data.specializedRolesImplemented ? "Enabled" : "Not implemented"}</p></article></div><div className="mt-6 rounded-xl bg-slate-50 p-4"><p className="font-bold text-slate-800">Current authorization</p><p className="mt-1 text-sm text-slate-600">{data.message}</p></div></section></div>;
}
