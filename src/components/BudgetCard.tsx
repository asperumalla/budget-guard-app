import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BudgetCardProps {
  spent: number;
  budget: number;
  month: string;
}

const BudgetCard = ({ spent, budget, month }: BudgetCardProps) => {
  const remaining = budget - spent;
  const percentage = (spent / budget) * 100;
  const isOverBudget = spent > budget;

  return (
    <Card
      className={`p-6 rounded-2xl border-2 ${
        isOverBudget
          ? "border-destructive/50 glow-danger"
          : "border-success/50 glow-success"
      } animate-fade-in`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            {month} Budget
          </h3>
          <div
            className={`flex items-center gap-1 ${
              isOverBudget ? "text-destructive" : "text-success"
            }`}
          >
            {isOverBudget ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-4xl font-bold">${spent.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">
                of ${budget.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-2xl font-bold ${
                  isOverBudget ? "text-destructive" : "text-success"
                }`}
              >
                ${Math.abs(remaining).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {isOverBudget ? "over" : "left"}
              </p>
            </div>
          </div>

          <Progress
            value={Math.min(percentage, 100)}
            className={`h-3 ${isOverBudget ? "bg-destructive/20" : "bg-success/20"}`}
          />
        </div>
      </div>
    </Card>
  );
};

export default BudgetCard;
