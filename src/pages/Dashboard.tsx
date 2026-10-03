import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, CreditCard, IndianRupee, Receipt, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import ExpenseChart from "../components/ExpenseChart";
import { getExpenses } from "../services/expenseService";
import type { Expense } from "../types/Expense";

export default function Dashboard(){
 const [expenses,setExpenses]=useState<Expense[]>([]); const [loading,setLoading]=useState(true);
 const load=()=>getExpenses().then(setExpenses).catch(console.error).finally(()=>setLoading(false)); useEffect(()=>{load()},[]);
 const total=useMemo(()=>expenses.reduce((s,e)=>s+e.amount,0),[expenses]); const now=new Date(); const month=useMemo(()=>expenses.filter(e=>{const d=new Date(e.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()}).reduce((s,e)=>s+e.amount,0),[expenses]); const highest=Math.max(0,...expenses.map(e=>e.amount));
 const recent=[...expenses].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
 return <div className="page">
   <section className="hero-row">
  <div>
    <h1>Money, made <em>simple.</em></h1>
    <p>See where your money goes and make every student budget count.</p>
  </div></section>
   <div className="stats-grid"><StatCard label="Total expenses" value={`₹${total.toLocaleString("en-IN")}`} icon={IndianRupee} hint="All recorded spending"/><StatCard label="This month" value={`₹${month.toLocaleString("en-IN")}`} icon={CalendarDays} hint="Current month"/><StatCard label="Transactions" value={`${expenses.length}`} icon={Receipt} hint="Recorded entries"/><StatCard label="Highest expense" value={`₹${highest.toLocaleString("en-IN")}`} icon={TrendingUp} hint="Single transaction"/></div>
   <div className="content-grid"><section className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">BREAKDOWN</span><h3>Spending by category</h3></div><CreditCard size={20}/></div>{loading?<div className="empty">Loading chart…</div>:<ExpenseChart expenses={expenses}/>}</section>
   <section className="panel"><div className="panel-heading"><div><span className="eyebrow">ACTIVITY</span><h3>Recent expenses</h3></div><Link to="/expenses" className="text-link">View all <ArrowRight size={15}/></Link></div>{loading?<div className="empty">Loading…</div>:recent.length===0?<div className="empty">No expenses yet. Add your first one.</div>:<div className="transactions">{recent.map(e=><Transaction key={e.expenseId} expense={e}/>)}</div>}</section></div>
 </div>;
}
function Transaction({expense:e}:{expense:Expense}){return <div className="transaction"><div className="tx-icon">{e.category==="Food"?"🍴":e.category==="Travel"?"🚌":e.category==="Education"?"📚":e.category==="Shopping"?"🛍️":e.category==="Medical"?"💊":"✦"}</div><div className="tx-main"><b>{e.expenseName}</b><span>{e.category} · {e.date}</span></div><strong>₹{e.amount.toLocaleString("en-IN")}</strong></div>}