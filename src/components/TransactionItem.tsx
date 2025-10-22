import { ShoppingBag, Coffee, Car, Home, Utensils, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type TransactionCategory = "Food" | "Travel" | "Shopping" | "Bills" | "Entertainment" | "Other";

interface TransactionItemProps {
  merchant: string;
  amount: number;
  date: string;
  category: TransactionCategory;
  source?: 'static' | 'plaid';
  transaction_id?: string;
}

const categoryConfig: Record<TransactionCategory, { icon: any; color: string }> = {
  Food: { icon: Utensils, color: "bg-chart-4/20 text-chart-4 border-chart-4/30" },
  Travel: { icon: Car, color: "bg-chart-2/20 text-chart-2 border-chart-2/30" },
  Shopping: { icon: ShoppingBag, color: "bg-chart-1/20 text-chart-1 border-chart-1/30" },
  Bills: { icon: Home, color: "bg-chart-3/20 text-chart-3 border-chart-3/30" },
  Entertainment: { icon: Coffee, color: "bg-chart-5/20 text-chart-5 border-chart-5/30" },
  Other: { icon: MoreHorizontal, color: "bg-muted text-muted-foreground border-border" },
};

const TransactionItem = ({ merchant, amount, date, category, source, transaction_id }: TransactionItemProps) => {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${config.color} border`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">{merchant}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">{date}</p>
            <Badge variant="outline" className={`${config.color} text-xs`}>
              {category}
            </Badge>
            {source === 'plaid' && (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                Bank
              </Badge>
            )}
            {source === 'static' && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 border-gray-200">
                Demo
              </Badge>
            )}
          </div>
        </div>
      </div>
      <p className="text-lg font-semibold">-${amount.toFixed(2)}</p>
    </div>
  );
};

export default TransactionItem;
