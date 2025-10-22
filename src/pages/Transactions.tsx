import { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import TransactionItem, { type TransactionCategory } from "@/components/TransactionItem";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Extended transaction type to include Plaid data
interface PlaidTransaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name?: string;
  category?: string[];
  account_owner?: string;
}

interface TransactionData {
  merchant: string;
  amount: number;
  date: string;
  category: TransactionCategory;
  source: 'static' | 'plaid';
  transaction_id?: string;
}

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | "All">("All");
  const [plaidTransactions, setPlaidTransactions] = useState<TransactionData[]>([]);
  const [isLoadingPlaid, setIsLoadingPlaid] = useState(false);
  const [hasPlaidData, setHasPlaidData] = useState(false);

  // Static transactions with source indicator
  const staticTransactions: TransactionData[] = [
    { merchant: "Whole Foods", amount: 45.32, date: "Jan 18", category: "Food" as TransactionCategory, source: 'static' },
    { merchant: "Uber", amount: 18.50, date: "Jan 17", category: "Travel" as TransactionCategory, source: 'static' },
    { merchant: "Amazon", amount: 89.99, date: "Jan 16", category: "Shopping" as TransactionCategory, source: 'static' },
    { merchant: "Netflix", amount: 15.99, date: "Jan 15", category: "Entertainment" as TransactionCategory, source: 'static' },
    { merchant: "Starbucks", amount: 6.75, date: "Jan 14", category: "Food" as TransactionCategory, source: 'static' },
    { merchant: "Shell Gas", amount: 52.00, date: "Jan 13", category: "Travel" as TransactionCategory, source: 'static' },
    { merchant: "Electric Bill", amount: 95.00, date: "Jan 12", category: "Bills" as TransactionCategory, source: 'static' },
    { merchant: "Target", amount: 124.50, date: "Jan 11", category: "Shopping" as TransactionCategory, source: 'static' },
    { merchant: "Chipotle", amount: 14.25, date: "Jan 10", category: "Food" as TransactionCategory, source: 'static' },
    { merchant: "Spotify", amount: 9.99, date: "Jan 9", category: "Entertainment" as TransactionCategory, source: 'static' },
  ];

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

  // Function to fetch Plaid transactions
  const fetchPlaidTransactions = async () => {
    setIsLoadingPlaid(true);
    try {
      const plaidApiBase = import.meta.env.VITE_PLAID_API_URL as string;
      if (!plaidApiBase) {
        throw new Error("VITE_PLAID_API_URL environment variable is not set");
      }
      const endpoint = `${plaidApiBase.replace(/\/$/, "")}/api/plaid/transactions/get`;
      
   

      // Fetch request using environment variables
      const requestBody = {
        access_token: import.meta.env.VITE_PLAID_ACCESS_TOKEN as string,
        start_date: import.meta.env.VITE_PLAID_START_DATE as string,
        end_date: import.meta.env.VITE_PLAID_END_DATE as string
      };


      console.log('Fetching Plaid transactions from:', endpoint);
      console.log('Request body:', requestBody);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Plaid transactions error:', errorText);
        
        // Check if it's an invalid access token error
        if (errorText.includes('INVALID_ACCESS_TOKEN')) {
          toast.error("Your bank connection has expired. Please reconnect in Settings.");
        } else {
          throw new Error(`Failed to fetch transactions (${response.status}): ${errorText}`);
        }
        return;
      }

      const data = await response.json();
      console.log('Plaid transactions response:', data);

      // Transform Plaid transactions to our format
      const transformedTransactions: TransactionData[] = data.transactions?.map((tx: PlaidTransaction) => ({
        merchant: tx.merchant_name || tx.name,
        amount: Math.abs(tx.amount), // Plaid uses negative for debits
        date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        category: mapPlaidCategory(tx.category),
        source: 'plaid' as const,
        transaction_id: tx.transaction_id,
      })) || [];

      setPlaidTransactions(transformedTransactions);
      setHasPlaidData(true);
      toast.success(`Loaded ${transformedTransactions.length} transactions from your bank!`);
      
    } catch (error) {
      console.error('Error fetching Plaid transactions:', error);
      toast.error(`Failed to load bank transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingPlaid(false);
    }
  };

  // Combine static and Plaid transactions
  const allTransactions = [...staticTransactions, ...plaidTransactions];

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
            onClick={fetchPlaidTransactions} 
            disabled={isLoadingPlaid}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingPlaid ? 'animate-spin' : ''}`} />
            {isLoadingPlaid ? 'Loading...' : hasPlaidData ? 'Refresh Bank Data' : 'Load Bank Data'}
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
                {plaidTransactions.length} bank transactions + {staticTransactions.length} demo transactions
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
