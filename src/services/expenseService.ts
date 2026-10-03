import type { Expense, ExpenseCategory } from "../types/Expense";
import { getAccessToken } from "./authService";

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const API = import.meta.env.VITE_API_BASE_URL;
const LOCAL_KEY = "expenseflow_local_expenses";

const seed: Expense[] = [
  { userId: "demo-user", expenseId: "1", expenseName: "Lunch", amount: 150, category: "Food", date: new Date().toISOString().slice(0,10), description: "College canteen", createdAt: new Date().toISOString() },
  { userId: "demo-user", expenseId: "2", expenseName: "Bus Pass", amount: 650, category: "Travel", date: new Date(Date.now()-86400000*2).toISOString().slice(0,10), description: "Monthly travel", createdAt: new Date().toISOString() },
  { userId: "demo-user", expenseId: "3", expenseName: "Notebook", amount: 220, category: "Education", date: new Date(Date.now()-86400000*4).toISOString().slice(0,10), description: "Semester notes", createdAt: new Date().toISOString() }
];

function localExpenses(): Expense[] {
  const saved = localStorage.getItem(LOCAL_KEY);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(seed));
  return seed;
}

export async function getExpenses(): Promise<Expense[]> {
  if (!API) return localExpenses();
  const token = await getAccessToken();
  const response = await fetch(`${API}/expenses`, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error("Could not load expenses.");
  return response.json();
}

export async function addExpense(data: Omit<Expense, "userId"|"expenseId"|"createdAt">): Promise<Expense> {
  if (!API) {
    const item: Expense = { ...data, userId: "demo-user", expenseId: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const all = [item, ...localExpenses()];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
    return item;
  }
  const token = await getAccessToken();
  const response = await fetch(`${API}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Could not add expense.");
  return response.json();
}

export async function deleteExpense(id: string): Promise<void> {
  if (!API) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(localExpenses().filter(e => e.expenseId !== id)));
    return;
  }
  const token = await getAccessToken();
  const response = await fetch(`${API}/expenses/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Could not delete expense.");
}

export const categories: ExpenseCategory[] = ["Food","Travel","Education","Shopping","Entertainment","Medical","Other"];