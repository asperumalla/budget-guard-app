import { Bell, Smartphone, CreditCard, Building2, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { usePlaidLink } from "react-plaid-link";
import { useAuth0 } from "@auth0/auth0-react";
import { useConfig } from "@/config/ConfigContext";
import { logger } from "@/lib/logger";

interface ConnectedAccount {
  account_id: string;
  name: string;
  type?: string;
  subtype?: string;
  mask?: string;
  institution_id?: string;
  institution_icon_url?: string;
  item_id?: string;
  balances?: {
    available?: number;
    current?: number;
    limit?: number;
    iso_currency_code?: string;
  };
}

const Settings = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const config = useConfig();
  const [isConnecting, setIsConnecting] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [failedIcons, setFailedIcons] = useState<Set<string>>(new Set());

  // Fetch connected accounts
  const fetchConnectedAccounts = useCallback(async () => {
    if (!isAuthenticated) {
      setConnectedAccounts([]);
      return;
    }

    setIsLoadingAccounts(true);
    try {
      const accessToken = await getAccessTokenSilently();
      if (!accessToken) {
        throw new Error("Failed to get Auth0 access token");
      }

      const apiBase = config.api.plaidApiUrl.replace(/\/$/, "");
      const accountsEndpoint = `${apiBase}/api/user/accounts`;

      const response = await fetch(accountsEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auth0AccessToken: accessToken }),
      });

      if (response.ok) {
        const data = await response.json();
        logger.log('Accounts response data:', data);
        const accounts = data.accounts || [];
        logger.log('Parsed accounts:', accounts);
        // Log each account's icon URL for debugging
        accounts.forEach((account: ConnectedAccount, index: number) => {
          logger.log(`Account ${index} (${account.name}): institution_icon_url =`, account.institution_icon_url);
        });
        setConnectedAccounts(accounts);
      } else {
        throw new Error('Failed to fetch accounts');
      }
    } catch (error) {
      logger.error('Error fetching accounts:', error);
      setConnectedAccounts([]);
    } finally {
      setIsLoadingAccounts(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  // Load accounts on mount and when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchConnectedAccounts();
    }
  }, [isAuthenticated, fetchConnectedAccounts]);

  // Plaid Link configuration
  const plaidConfig = {
    token: linkToken,
    onSuccess: async (publicToken: string, metadata: { institution?: { name: string }; accounts?: Array<{ id: string; name: string }> }) => {
      logger.log('Plaid Link Success:', { publicToken, metadata });
      toast.success("Bank account connected successfully!");
      
      // Exchange public token for access token on your backend with Auth0 token
      try {
        const accessToken = await getAccessTokenSilently();
        if (!accessToken) {
          throw new Error("Failed to get Auth0 access token");
        }

        const apiBase = config.api.plaidApiUrl.replace(/\/$/, "");
        const exchangeEndpoint = `${apiBase}/api/plaid/access-token/exchange`;
        
        const response = await fetch(exchangeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            public_token: publicToken,
            auth0_access_token: accessToken
          }),
        });

        if (response.ok) {
          const data = await response.json();
          logger.log('Access token exchange successful:', data);
          toast.success("Bank account linked and ready!");
          // Refresh accounts list
          await fetchConnectedAccounts();
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to exchange public token');
        }
      } catch (error) {
        logger.error('Token exchange error:', error);
        toast.error(`Failed to complete bank connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      setIsConnecting(false);
      setLinkToken(null);
    },
    onExit: (err: Error | null, metadata: { institution?: { name: string }; status?: string }) => {
      logger.log('Plaid Link Exit:', { err, metadata });
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
    logger.log('Plaid Link state:', { ready, plaidError, linkToken });
  }, [ready, plaidError, linkToken]);

  // Auto-open Plaid Link when token is set
  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

  const handleConnectBank = async () => {
    logger.log('Button clicked!', { isConnecting, ready, linkToken });
    
    // Simple test - just show a toast first
    toast.info("Button clicked! Starting bank connection...");
    
    if (isConnecting) {
      logger.log('Already connecting, returning early');
      return;
    }
    
    setIsConnecting(true);

    // Call the Plaid link token creation endpoint to obtain a link token
    const apiBase = config.api.plaidApiUrl.replace(/\/$/, "");
    const plaidEndpoint = `${apiBase}/api/plaid/link-token/create`;

    try {
      logger.log('Requesting link token from:', plaidEndpoint);
      const plaidResponse = await fetch(plaidEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      logger.log('Response status:', plaidResponse.status);
      
      if (!plaidResponse.ok) {
        const errorText = await plaidResponse.text();
        logger.error('Error response:', errorText);
        throw new Error(`Plaid link token request failed (${plaidResponse.status}): ${errorText}`);
      }

      const plaidData = await plaidResponse.json();
      logger.log('Plaid response data:', plaidData);
      
      const plaidLinkToken = plaidData.link_token;

      if (!plaidLinkToken) {
        throw new Error("Missing link_token in Plaid response");
      }

      // Set the link token and open Plaid Link
      setLinkToken(plaidLinkToken);
      toast.success("Opening bank connection...");
      
      // The usePlaidLink hook will automatically open when linkToken is set
    } catch (error) {
      logger.error('Plaid Link Token Error:', error);
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
          <h3 className="text-lg font-semibold">Bank Accounts</h3>
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

          {/* Connected Accounts List */}
          {isLoadingAccounts ? (
            <div className="text-center py-4 text-muted-foreground">
              <p>Loading accounts...</p>
            </div>
          ) : connectedAccounts.length > 0 ? (
            <div className="space-y-3 mt-4">
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Connected Accounts</p>
                {connectedAccounts.map((account, index) => (
                  <div
                    key={account.account_id || index}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/50"
                  >
                    {/* Institution Icon */}
                    {(() => {
                      const iconUrl = account.institution_icon_url;
                      const iconFailed = iconUrl ? failedIcons.has(iconUrl) : true;
                      const showFallback = !iconUrl || iconFailed;
                      
                      return (
                        <div className="relative w-10 h-10">
                          {!showFallback && iconUrl ? (
                            <img
                              src={iconUrl}
                              alt={account.institution_id || "Bank"}
                              className="w-10 h-10 rounded-lg object-contain bg-white p-1"
                              onError={() => {
                                logger.warn('Failed to load institution icon:', iconUrl);
                                setFailedIcons(prev => new Set(prev).add(iconUrl));
                              }}
                              onLoad={() => {
                                logger.log('Successfully loaded institution icon:', iconUrl);
                              }}
                            />
                          ) : null}
                          {/* Fallback icon - shown when no icon_url or image fails to load */}
                          {showFallback ? (
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                          ) : null}
                        </div>
                      );
                    })()}

                    {/* Account Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{account.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{account.type} {account.subtype ? `• ${account.subtype}` : ''}</span>
                        {account.mask && <span>• •••{account.mask}</span>}
                      </div>
                      {account.balances?.current !== undefined && (
                        <p className="text-xs font-medium mt-1">
                          ${account.balances.current.toFixed(2)} {account.balances.iso_currency_code || 'USD'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No bank accounts connected yet</p>
            </div>
          )}
        </Card>
      </div>

      {/* App Info */}
      <Card className="p-4 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 card-shadow">
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">{config.ui.appName}</p>
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
