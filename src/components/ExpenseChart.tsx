import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Expense } from "../types/Expense";

export default function ExpenseChart({ expenses }: { expenses: Expense[] }) {
  const data = Object.entries(expenses.reduce<Record<string, number>>((a,e) => { a[e.category]=(a[e.category]||0)+e.amount; return a; }, {})).map(([name,value])=>({name,value}));
  const fallback = data.length ? data : [{name:"No data",value:1}];
  return <div className="chart-wrap"><ResponsiveContainer width="100%" height={230}><PieChart><Pie data={fallback} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={3}>{fallback.map((_,i)=><Cell key={i}/>)}</Pie><Tooltip formatter={(v:number)=>`₹${v.toLocaleString("en-IN")}`}/></PieChart></ResponsiveContainer>
    <div className="legend">{data.map(d=><div key={d.name}><span className="dot"/><span>{d.name}</span><b>₹{d.value.toLocaleString("en-IN")}</b></div>)}</div>
  </div>;
}