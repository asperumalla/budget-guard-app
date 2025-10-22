import { Bell, Smartphone, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { usePlaidLink } from "react-plaid-link";

const Settings = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);

  // Plaid Link configuration
  const plaidConfig = {
    token: linkToken,
    onSuccess: async (publicToken: string, metadata: any) => {
      console.log('Plaid Link Success:', { publicToken, metadata });
      toast.success("Bank account connected successfully!");
      
      // Exchange public token for access token on your backend
      try {
        const plaidApiBase = import.meta.env.VITE_PLAID_API_URL as string | undefined;
        const exchangeEndpoint = `${plaidApiBase ? `${plaidApiBase.replace(/\/$/, "")}` : "http://localhost:8090"}/api/plaid/access-token/exchange`;
        
        const response = await fetch(exchangeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token: publicToken }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Access token exchange successful:', data);
          toast.success("Bank account linked and ready!");
        } else {
          throw new Error('Failed to exchange public token');
        }
      } catch (error) {
        console.error('Token exchange error:', error);
        toast.error("Failed to complete bank connection. Please try again.");
      }
      
      setIsConnecting(false);
      setLinkToken(null);
    },
    onExit: (err: any, metadata: any) => {
      console.log('Plaid Link Exit:', { err, metadata });
      if (err) {
        toast.error("Bank connection was cancelled or failed.");
      }
      setIsConnecting(false);
      setLinkToken(null);
    },
  };

  const { open, ready, error: plaidError } = usePlaidLink(plaidConfig);

  // Debug Plaid Link state
  useEffect(() => {
    console.log('Plaid Link state:', { ready, plaidError, linkToken });
  }, [ready, plaidError, linkToken]);

  // Auto-open Plaid Link when token is set
  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

  const handleConnectBank = async () => {
    console.log('Button clicked!', { isConnecting, ready, linkToken });
    
    // Simple test - just show a toast first
    toast.info("Button clicked! Starting bank connection...");
    
    if (isConnecting) {
      console.log('Already connecting, returning early');
      return;
    }
    
    setIsConnecting(true);

    // Call the Plaid link token creation endpoint to obtain a link token
    const plaidApiBase = import.meta.env.VITE_PLAID_API_URL as string | undefined;
    const plaidEndpoint = `${plaidApiBase ? `${plaidApiBase.replace(/\/$/, "")}` : "http://localhost:8090"}/api/plaid/link-token/create`;

    try {
      console.log('Requesting link token from:', plaidEndpoint);
      const plaidResponse = await fetch(plaidEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      console.log('Response status:', plaidResponse.status);
      
      if (!plaidResponse.ok) {
        const errorText = await plaidResponse.text();
        console.error('Error response:', errorText);
        throw new Error(`Plaid link token request failed (${plaidResponse.status}): ${errorText}`);
      }

      const plaidData = await plaidResponse.json();
      console.log('Plaid response data:', plaidData);
      
      const plaidLinkToken = plaidData.link_token;

      if (!plaidLinkToken) {
        throw new Error("Missing link_token in Plaid response");
      }

      // Set the link token and open Plaid Link
      setLinkToken(plaidLinkToken);
      toast.success("Opening bank connection...");
      
      // The usePlaidLink hook will automatically open when linkToken is set
    } catch (error) {
      console.error('Plaid Link Token Error:', error);
      toast.error(`Unable to create bank connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsConnecting(false);
    }
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
          <Button onClick={handleConnectBank} disabled={isConnecting} aria-busy={isConnecting} className="w-full h-12 rounded-xl gradient-primary border-0">
            <Smartphone className="mr-2 h-5 w-5" />
            {isConnecting ? "Connecting..." : "Connect Bank Account"}
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
