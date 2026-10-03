import { ArrowUpRight, LucideIcon } from "lucide-react";

export default function StatCard({ label, value, icon: Icon, hint }: {label:string; value:string; icon:LucideIcon; hint:string}) {
  return <div className="stat-card">
    <div className="stat-top"><div className="icon-box"><Icon size={19}/></div><ArrowUpRight size={17} className="muted"/></div>
    <span>{label}</span><strong>{value}</strong><small>{hint}</small>
  </div>;
}