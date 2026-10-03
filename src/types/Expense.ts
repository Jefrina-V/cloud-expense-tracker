export type ExpenseCategory =
  | "Food"
  | "Travel"
  | "Education"
  | "Shopping"
  | "Entertainment"
  | "Medical"
  | "Other";

export interface Expense {
  userId: string;
  expenseId: string;
  expenseName: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description: string;
  createdAt: string;
}