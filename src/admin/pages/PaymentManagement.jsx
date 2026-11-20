import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { getAdminPaymentStatus } from "../services/adminApi";

export default function PaymentManagement() {
  const [data, setData] = useState(null); const [error, setError] = useState("");
  useEffect(() => { getAdminPaymentStatus().then((body) => setData(body.data)).catch((err) => setError(err.message)); }, []);
  if (error) return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>;
  if (!data) return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">Loading payment integration status...</div>;
  const cards = [["Orders", data.orders],["Transactions", data.transactions],["Refunds", data.refunds],["Teacher payouts", data.teacherPayouts]];
  return <div className="space-y-6 text-left"><div><p className="text-sm font-bold text-indigo-600">Billing</p><h1 className="m-0 mt-1 text-3xl font-black text-slate-950">Payments and orders</h1></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-6"><div className="flex items-start gap-3"><CreditCard className="mt-0.5 size-5 text-amber-700"/><div><p className="font-black text-amber-900">Payment integration not configured</p><p className="mt-2 text-sm text-amber-800">{data.message}</p></div></div></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label,value]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-slate-950">{value}</p></article>)}</div></div>;
}
