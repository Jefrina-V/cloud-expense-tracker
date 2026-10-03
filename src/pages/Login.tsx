import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, WalletCards } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const {login,user,demoMode}=useAuth(); const navigate=useNavigate(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [show,setShow]=useState(false); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  if(user){navigate("/dashboard",{replace:true}); return null;}
  async function submit(e:FormEvent){e.preventDefault();setError("");try{setBusy(true);await login(email,password);navigate("/dashboard");}catch(err:any){setError(err.message||"Unable to login.");}finally{setBusy(false);}}
  return <AuthLayout title="Welcome back" subtitle="Sign in to keep your student spending on track.">
    {error&&<div className="form-error">{error}</div>}
    <form className="auth-form" onSubmit={submit}>
      <label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
      <label>Password<div className="password-wrap"><input type={show?"text":"password"} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
      <button className="primary-btn" disabled={busy}>{busy?"Signing in…":"Sign in"}<ArrowRight size={18}/></button>
    </form>
    <p className="auth-switch">New here? <Link to="/signup">Create an account</Link></p>
  </AuthLayout>;
}

function AuthLayout({title,subtitle,children}:{title:string;subtitle:string;children:any}){
  return <div className="auth-page"><div className="auth-visual"><div className="visual-grid"/><div className="visual-content"><div className="auth-brand"><WalletCards size={22}/> ExpenseFlow</div><h1>Spend smarter.<br/><em>Live lighter.</em></h1><p>A beautiful cloud-based space for students to understand every rupee.</p><div className="floating-card"><span>This month</span><strong>₹3,240</strong><small>↓ 12.4% from last month</small></div></div></div><div className="auth-panel"><div className="auth-card"><div className="auth-mobile-logo"><WalletCards/> ExpenseFlow</div><h2>{title}</h2><p>{subtitle}</p>{children}<small className="privacy">Your data is protected by Amazon Cognito and AWS.</small></div></div></div>
}