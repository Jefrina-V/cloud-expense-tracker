import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, LayoutDashboard, LogOut, Plus, ReceiptText, Sparkles, WalletCards } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const nav = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/expenses", label: "Transactions", icon: ReceiptText },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><WalletCards size={21}/></div>
          <div><strong>ExpenseFlow</strong><span>Student finance</span></div>
        </div>
        <nav>
          {nav.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><Icon size={18}/><span>{label}</span></NavLink>)}
          <NavLink to="/add-expense" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><Plus size={18}/><span>Add expense</span></NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-profile"><div className="avatar">{(user?.name?.[0] || "S").toUpperCase()}</div><div><b>{user?.name || "Student"}</b><span>{user?.email}</span></div></div>
          <button className="logout-btn" onClick={() => { logout(); navigate("/login"); }}><LogOut size={17}/> Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">PERSONAL FINANCE</span>
            <h2>{location.pathname === "/dashboard" ? "Your financial overview" : location.pathname === "/expenses" ? "All transactions" : location.pathname === "/analytics" ? "Spending analytics" : "Add a new expense"}</h2>
          </div>
        <div className="top-actions">
  <div className="top-avatar">
    {(user?.name?.[0] || "S").toUpperCase()}
  </div>
</div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}