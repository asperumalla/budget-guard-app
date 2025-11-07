import { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import TransactionItem, { type TransactionCategory } from "@/components/TransactionItem";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { PlaidTransaction } from "@/services/api";

interface TransactionData {
  merchant: string;
  amount: number;
  date: string;
  category: TransactionCategory;
  source: 'static' | 'plaid';
  transaction_id?: string;
}

const Transactions = () => {
  const { transactions: plaidTransactionsFromContext, isLoadingTransactions, refreshTransactions, user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | "All">("All");

  // Function to map Plaid categories to our TransactionCategory
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

  // Transform Plaid transactions from context to our TransactionData format
  const plaidTransactions: TransactionData[] = plaidTransactionsFromContext.map((tx: PlaidTransaction) => ({
    merchant: tx.merchant_name || tx.name,
    amount: Math.abs(tx.amount), // Plaid uses negative for debits
    date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    category: mapPlaidCategory(tx.category),
    source: 'plaid' as const,
    transaction_id: tx.transaction_id,
  }));

  // Handle refresh button click
  const handleRefreshTransactions = async () => {
    try {
      await refreshTransactions();
      if (plaidTransactionsFromContext.length > 0) {
        toast.success(`Refreshed ${plaidTransactionsFromContext.length} transactions from your bank!`);
      } else {
        toast.info("No transactions found. If you haven't connected your bank, please do so in Settings.");
      }
    } catch (error) {
      console.error('Error refreshing transactions:', error);
      toast.error(`Failed to refresh transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Show error message if user is Auth0 authenticated but no transactions loaded
  useEffect(() => {
    if (isAuthenticated && user && user.id !== "demo-user-123" && !isLoadingTransactions && plaidTransactionsFromContext.length === 0) {
      // This means user is Auth0 authenticated but no transactions were found
      // Could mean: 1) Plaid not connected, 2) No transactions in date range, 3) Error occurred
      // We'll show this info in the UI, not as an error toast
    }
  }, [isAuthenticated, user, isLoadingTransactions, plaidTransactionsFromContext.length]);

  // Use only backend transactions (no static/mock data)
  const hasPlaidData = plaidTransactions.length > 0;
  const allTransactions = plaidTransactions; // Only show transactions from backend

  const categories: Array<TransactionCategory | "All"> = ["All", "Food", "Travel", "Shopping", "Bills", "Entertainment"];

  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch = transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || transaction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <Button 
            onClick={handleRefreshTransactions} 
            disabled={isLoadingTransactions}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingTransactions ? 'animate-spin' : ''}`} />
            {isLoadingTransactions ? 'Loading...' : hasPlaidData ? 'Refresh Bank Data' : 'Load Bank Data'}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl bg-secondary border-border"
          />
        </div>

        {/* Period Filter */}
        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-secondary">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap px-4 py-2 rounded-full"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Total Summary */}
      <Card className="p-4 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 card-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
            {hasPlaidData && (
              <p className="text-xs text-blue-600 mt-1">
                {plaidTransactions.length} transactions from your bank
              </p>
            )}
          </div>
          <p className="text-2xl font-bold text-primary">-${totalSpent.toFixed(2)}</p>
        </div>
      </Card>

      {/* Transactions List */}
      <Card className="p-2 rounded-2xl border border-border space-y-1 card-shadow bg-card">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <TransactionItem key={index} {...transaction} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No transactions found</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;
