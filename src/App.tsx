import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";

export default function App(){
 return <Routes>
   <Route path="/login" element={<Login/>}/>
   <Route path="/signup" element={<Signup/>}/>
   <Route element={<ProtectedRoute/>}>
     <Route element={<AppShell/>}>
       <Route path="/dashboard" element={<Dashboard/>}/>
       <Route path="/add-expense" element={<AddExpense/>}/>
       <Route path="/expenses" element={<Expenses/>}/>
       <Route path="/analytics" element={<Analytics/>}/>
     </Route>
   </Route>
   <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
 </Routes>;
}