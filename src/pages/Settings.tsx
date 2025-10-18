import { Bell, Smartphone, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Settings = () => {
  const handleConnectBank = () => {
    toast.success("Bank connection feature coming soon!");
  };

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences</p>
      </header>

      {/* Notifications Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>

        <Card className="p-4 rounded-2xl border border-border space-y-4 card-shadow bg-card">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="daily-alerts" className="text-base font-medium">
                Daily Spending Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified about your daily expenses
              </p>
            </div>
            <Switch id="daily-alerts" defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="budget-alerts" className="text-base font-medium">
                Budget Exceeded Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Alert when you go over budget
              </p>
            </div>
            <Switch id="budget-alerts" defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="push-notifications" className="text-base font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable push notifications
              </p>
            </div>
            <Switch id="push-notifications" />
          </div>
        </Card>
      </div>

      {/* Bank Connection Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Bank Account</h3>
        </div>

        <Card className="p-6 rounded-2xl border border-border space-y-4 card-shadow bg-card">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Connect your bank account to automatically track transactions
            </p>
          </div>
          <Button onClick={handleConnectBank} className="w-full h-12 rounded-xl gradient-primary border-0">
            <Smartphone className="mr-2 h-5 w-5" />
            Connect Bank Account
          </Button>
        </Card>
      </div>

      {/* App Info */}
      <Card className="p-4 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 card-shadow">
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">BudgetGuard</p>
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
