import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, Calendar } from "lucide-react";
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

const SetBudget = () => {
  const navigate = useNavigate();
  const [budgetAmount, setBudgetAmount] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleSave = () => {
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    toast.success(`Budget of $${budgetAmount} set for ${selectedMonth}`);
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Set Monthly Budget</h1>
        <p className="text-muted-foreground">Control your spending with a clear goal</p>
      </header>

      {/* Budget Form */}
      <Card className="p-6 rounded-2xl border border-border space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="budget" className="text-sm font-medium">
            Budget Amount
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="budget"
              type="number"
              placeholder="0.00"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="pl-12 h-14 text-2xl font-bold rounded-xl bg-secondary border-border"
            />
          </div>
        </div>

        {/* Month Selection */}
        <div className="space-y-2">
          <Label htmlFor="month" className="text-sm font-medium">
            Select Month
          </Label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger id="month" className="h-12 rounded-xl bg-secondary border-border">
              <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
              <SelectValue placeholder="Select a month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full h-12 rounded-xl text-base font-semibold gradient-primary border-0 glow-primary"
        >
          Save Budget
        </Button>
      </Card>

      {/* Current Budget Summary */}
      <Card className="p-6 rounded-2xl border border-border bg-secondary/50">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Current Budget Progress</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">$420</p>
            <p className="text-xs text-muted-foreground mt-1">Spent</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">$180</p>
            <p className="text-xs text-muted-foreground mt-1">Remaining</p>
          </div>
          <div>
            <p className="text-2xl font-bold">$600</p>
            <p className="text-xs text-muted-foreground mt-1">Budget</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SetBudget;
