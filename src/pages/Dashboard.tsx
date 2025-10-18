import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BudgetCard from "@/components/BudgetCard";
import TransactionItem, { type TransactionCategory } from "@/components/TransactionItem";
import SpendingChart from "@/components/SpendingChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const userName = "Alex";
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  // Mock data
  const budget = 600;
  const spent = 420;

  const recentTransactions = [
    { merchant: "Whole Foods", amount: 45.32, date: "Today", category: "Food" as TransactionCategory },
    { merchant: "Uber", amount: 18.50, date: "Yesterday", category: "Travel" as TransactionCategory },
    { merchant: "Amazon", amount: 89.99, date: "2 days ago", category: "Shopping" as TransactionCategory },
    { merchant: "Netflix", amount: 15.99, date: "Jan 15", category: "Entertainment" as TransactionCategory },
    { merchant: "Starbucks", amount: 6.75, date: "Jan 14", category: "Food" as TransactionCategory },
  ];

  const categoryData = [
    { name: "Food", value: 150, color: "hsl(43, 74%, 66%)" },
    { name: "Travel", value: 80, color: "hsl(173, 58%, 39%)" },
    { name: "Shopping", value: 120, color: "hsl(262, 67%, 62%)" },
    { name: "Bills", value: 50, color: "hsl(197, 37%, 24%)" },
    { name: "Entertainment", value: 20, color: "hsl(27, 87%, 67%)" },
  ];

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
          Hello, {userName} 👋
        </h1>
        <p className="text-muted-foreground">Here's your spending overview</p>
      </header>

      {/* Budget Card */}
      <BudgetCard spent={spent} budget={budget} month={currentMonth} />

      {/* Category Spending Chart */}
      <Card className="p-6 rounded-2xl border border-border relative overflow-hidden">
        <div className="absolute inset-0 gradient-card opacity-50" />
        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <SpendingChart data={categoryData} />
        </div>
      </Card>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Link to="/transactions">
            <Button variant="ghost" size="sm" className="text-primary">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Card className="p-2 rounded-2xl border border-border relative overflow-hidden">
          <div className="absolute inset-0 gradient-card opacity-30" />
          <div className="relative z-10 space-y-1">
            {recentTransactions.map((transaction, index) => (
              <TransactionItem key={index} {...transaction} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
