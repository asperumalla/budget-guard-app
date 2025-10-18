import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, Store, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { TransactionCategory } from "@/components/TransactionItem";

const AddExpense = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState<TransactionCategory>("Other");

  const categories: TransactionCategory[] = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Other"];

  const handleAddExpense = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!merchant.trim()) {
      toast.error("Please enter a merchant name");
      return;
    }

    toast.success(`Added $${amount} expense from ${merchant}`);
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Add Expense</h1>
        <p className="text-muted-foreground">Track a new transaction</p>
      </header>

      {/* Expense Form */}
      <Card className="p-6 rounded-2xl border border-border space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-12 h-14 text-2xl font-bold rounded-xl bg-secondary border-border"
            />
          </div>
        </div>

        {/* Merchant Input */}
        <div className="space-y-2">
          <Label htmlFor="merchant" className="text-sm font-medium">
            Merchant
          </Label>
          <div className="relative">
            <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="merchant"
              type="text"
              placeholder="e.g., Whole Foods"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="pl-12 h-12 rounded-xl bg-secondary border-border"
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Category
          </Label>
          <Select value={category} onValueChange={(value) => setCategory(value as TransactionCategory)}>
            <SelectTrigger id="category" className="h-12 rounded-xl bg-secondary border-border">
              <Tag className="mr-2 h-5 w-5 text-muted-foreground" />
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Display */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Date</Label>
          <div className="flex items-center gap-2 p-4 rounded-xl bg-secondary border border-border">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Add Button */}
        <Button
          onClick={handleAddExpense}
          className="w-full h-12 rounded-xl text-base font-semibold gradient-primary border-0 glow-primary"
        >
          Add Expense
        </Button>
      </Card>
    </div>
  );
};

export default AddExpense;
