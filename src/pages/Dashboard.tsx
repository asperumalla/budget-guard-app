import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BudgetCard from "@/components/BudgetCard";
import TransactionItem, { type TransactionCategory } from "@/components/TransactionItem";
import SpendingChart from "@/components/SpendingChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PlaidTransaction } from "@/services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const userName = user?.name || "User";
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  // Mock data
  const budget = 600;
  const spent = 420;

  // Get transactions from backend via AuthContext
  const { transactions: plaidTransactions, isLoadingTransactions } = useAuth();
  
  // Transform Plaid transactions to TransactionData format for display
  type TransactionCategory = "Food" | "Travel" | "Shopping" | "Bills" | "Entertainment" | "Other";
  
  const mapPlaidCategory = (plaidCategories: string[] | undefined): TransactionCategory => {
    if (!plaidCategories || plaidCategories.length === 0) return "Other";
    
    const categoryMap: { [key: string]: TransactionCategory } = {
      'Food and Drink': 'Food',
      'Transportation': 'Travel',
      'Shops': 'Shopping',
      'Bills and Utilities': 'Bills',
      'Entertainment': 'Entertainment',
      'Gas Stations': 'Travel',
      'Restaurants': 'Food',
      'Groceries': 'Food',
      'Online Services': 'Entertainment',
      'Subscription Services': 'Entertainment',
    };

    for (const category of plaidCategories) {
      if (categoryMap[category]) {
        return categoryMap[category];
      }
    }
    return "Other";
  };

  const recentTransactions = plaidTransactions
    .slice(0, 5) // Show only first 5 transactions
    .map((tx) => ({
      merchant: tx.merchant_name || tx.name || "Unknown",
      amount: Math.abs(tx.amount),
      date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      category: mapPlaidCategory(tx.category) as TransactionCategory,
    }));

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
      <Card className="p-6 rounded-2xl border border-border relative overflow-hidden card-shadow bg-card">
        <div className="absolute inset-0 gradient-card opacity-30" />
        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <SpendingChart data={categoryData} />
        </div>
      </Card>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Link to="/budget/transactions">
            <Button variant="ghost" size="sm" className="text-primary">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Card className="p-2 rounded-2xl border border-border relative overflow-hidden card-shadow bg-card">
          <div className="absolute inset-0 gradient-card opacity-20" />
          <div className="relative z-10 space-y-1">
            {isLoadingTransactions ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Loading transactions...</p>
              </div>
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <TransactionItem key={index} {...transaction} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transactions yet</p>
                <p className="text-xs mt-2">Connect your bank account in Settings to see transactions</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
