import { FormEvent, useState } from "react";
import { categories, addExpense } from "../services/expenseService";
import type { ExpenseCategory } from "../types/Expense";

export default function ExpenseForm({ onSaved }: { onSaved: () => void }) {
  const [name,setName]=useState(""); const [amount,setAmount]=useState(""); const [category,setCategory]=useState<ExpenseCategory>("Food"); const [date,setDate]=useState(new Date().toISOString().slice(0,10)); const [description,setDescription]=useState(""); const [saving,setSaving]=useState(false); const [error,setError]=useState("");

  async function submit(e:FormEvent) {
    e.preventDefault(); setError("");
    if(!name.trim() || !amount || Number(amount)<=0) { setError("Enter a valid expense name and amount."); return; }
    try { setSaving(true); await addExpense({expenseName:name.trim(),amount:Number(amount),category,date,description:description.trim()}); onSaved(); setName(""); setAmount(""); setDescription(""); }
    catch(err:any){ setError(err.message || "Something went wrong."); } finally { setSaving(false); }
  }

  return <form className="expense-form" onSubmit={submit}>
    {error && <div className="form-error">{error}</div>}
    <label>Expense name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Lunch, Bus Pass, Books"/></label>
    <div className="form-grid">
      <label>Amount<input type="number" min="1" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="₹ 0"/></label>
      <label>Category<select value={category} onChange={e=>setCategory(e.target.value as ExpenseCategory)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
    </div>
    <label>Date<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>
    <label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Add a short note (optional)"/></label>
    <button className="primary-btn" disabled={saving}>{saving ? "Saving…" : "Save expense"}</button>
  </form>;
}