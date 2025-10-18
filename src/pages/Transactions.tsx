import { useState } from "react";
import { Search } from "lucide-react";
import TransactionItem, { type TransactionCategory } from "@/components/TransactionItem";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | "All">("All");

  const allTransactions = [
    { merchant: "Whole Foods", amount: 45.32, date: "Jan 18", category: "Food" as TransactionCategory },
    { merchant: "Uber", amount: 18.50, date: "Jan 17", category: "Travel" as TransactionCategory },
    { merchant: "Amazon", amount: 89.99, date: "Jan 16", category: "Shopping" as TransactionCategory },
    { merchant: "Netflix", amount: 15.99, date: "Jan 15", category: "Entertainment" as TransactionCategory },
    { merchant: "Starbucks", amount: 6.75, date: "Jan 14", category: "Food" as TransactionCategory },
    { merchant: "Shell Gas", amount: 52.00, date: "Jan 13", category: "Travel" as TransactionCategory },
    { merchant: "Electric Bill", amount: 95.00, date: "Jan 12", category: "Bills" as TransactionCategory },
    { merchant: "Target", amount: 124.50, date: "Jan 11", category: "Shopping" as TransactionCategory },
    { merchant: "Chipotle", amount: 14.25, date: "Jan 10", category: "Food" as TransactionCategory },
    { merchant: "Spotify", amount: 9.99, date: "Jan 9", category: "Entertainment" as TransactionCategory },
  ];

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
        <h1 className="text-3xl font-bold">Transactions</h1>

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
      <Card className="p-4 rounded-2xl border border-border bg-secondary/50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="text-2xl font-bold text-primary">-${totalSpent.toFixed(2)}</p>
        </div>
      </Card>

      {/* Transactions List */}
      <Card className="p-2 rounded-2xl border border-border space-y-1">
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
