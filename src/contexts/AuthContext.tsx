import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth0, User as Auth0User } from "@auth0/auth0-react";
import { fetchUserTransactions, type PlaidTransaction } from "@/services/api";
import { useConfig } from "@/config/ConfigContext";
import { logger } from "@/lib/logger";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  transactions: PlaidTransaction[];
  isLoadingTransactions: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Auth0 integration methods
  loginWithAuth0: () => Promise<void>;
  signUpWithAuth0: () => Promise<void>;
  // Transaction methods
  refreshTransactions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const config = useConfig();
  const [demoUser, setDemoUser] = useState<User | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [transactions, setTransactions] = useState<PlaidTransaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const {
    user: auth0User,
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  // Check for existing demo session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("budgetguard_demo_user");
    if (savedUser) {
      setDemoUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch transactions from backend using Auth0 token
  const refreshTransactions = useCallback(async () => {
    // Only fetch for Auth0 authenticated users
    if (!auth0IsAuthenticated || !auth0User) {
      logger.log("Skipping transaction fetch - user not authenticated with Auth0");
      return;
    }

    setIsLoadingTransactions(true);
    try {
      // Get Auth0 access token
      const accessToken = await getAccessTokenSilently();
      
      if (!accessToken) {
        throw new Error("Failed to get Auth0 access token");
      }

      logger.log("Fetching transactions with Auth0 token...");
      
      // Calculate date range (last 30 days by default)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      // Fetch transactions from backend
      const response = await fetchUserTransactions(
        accessToken,
        startDate.toISOString().split('T')[0], // Format: yyyy-MM-dd
        endDate.toISOString().split('T')[0]
      );

      if (response.transactions) {
        setTransactions(response.transactions);
        logger.log(`Successfully loaded ${response.transactions.length} transactions`);
      } else {
        setTransactions([]);
        logger.log("No transactions found in response");
      }
    } catch (error) {
      logger.error("Error fetching transactions:", error);
      setTransactions([]);
      // Don't show error toast here - let the Transactions page handle it
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [auth0IsAuthenticated, auth0User, getAccessTokenSilently]);

  // Fetch transactions when Auth0 user is authenticated
  useEffect(() => {
    if (auth0IsAuthenticated && auth0User && !auth0IsLoading) {
      refreshTransactions().catch((error) => {
        logger.error("Failed to fetch transactions on login:", error);
      });
    } else if (!auth0IsAuthenticated) {
      // Clear transactions when logged out
      setTransactions([]);
    }
  }, [auth0IsAuthenticated, auth0User, auth0IsLoading, refreshTransactions]);

  // Use Auth0 user if available, otherwise use demo user
  const user = auth0User ? {
    id: auth0User.sub || "auth0-user",
    email: auth0User.email || "",
    name: auth0User.name || auth0User.email?.split("@")[0] || "User",
    avatar: auth0User.picture
  } : demoUser;

  const isAuthenticated = auth0IsAuthenticated || !!demoUser;
  const isLoading = auth0IsLoading || isDemoLoading;

  const login = async (email: string, password: string) => {
    // For demo purposes, accept any email/password
    setIsDemoLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get primary color from config (remove # if present)
      const primaryColor = config.ui.theme.primaryColor.replace('#', '');
      const demoUser: User = {
        id: "demo-user-123",
        email: email,
        name: email.split("@")[0],
        avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=${primaryColor}&color=fff`
      };
      
      setDemoUser(demoUser);
      localStorage.setItem("budgetguard_demo_user", JSON.stringify(demoUser));
    } catch (error) {
      throw new Error("Login failed");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const logout = () => {
    if (auth0IsAuthenticated) {
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin + "/app/login",
        },
      });
    } else {
      setDemoUser(null);
      localStorage.removeItem("budgetguard_demo_user");
    }
  };

  // Auth0 integration methods
  const loginWithAuth0 = async () => {
    try {
      if (!loginWithRedirect) {
        throw new Error("Auth0 loginWithRedirect is not available. Please check Auth0 configuration.");
      }
      
      logger.log("Attempting Auth0 login redirect...");
      await loginWithRedirect({
        authorizationParams: {
          connection: "Username-Password-Authentication",
        },
      });
    } catch (error) {
      logger.error("Auth0 loginWithRedirect error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to redirect to Auth0 login";
      throw new Error(errorMessage);
    }
  };

  const signUpWithAuth0 = async () => {
    try {
      if (!loginWithRedirect) {
        throw new Error("Auth0 loginWithRedirect is not available. Please check Auth0 configuration.");
      }
      
      await loginWithRedirect({
        authorizationParams: {
          connection: "Username-Password-Authentication",
          screen_hint: "signup",
        },
      });
    } catch (error) {
      logger.error("Auth0 signUpWithAuth0 error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to redirect to Auth0 signup";
      throw new Error(errorMessage);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    transactions,
    isLoadingTransactions,
    login,
    logout,
    loginWithAuth0,
    signUpWithAuth0,
    refreshTransactions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
