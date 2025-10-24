import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth0, User as Auth0User } from "@auth0/auth0-react";

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Auth0 integration methods
  loginWithAuth0: () => Promise<void>;
  signUpWithAuth0: () => Promise<void>;
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
  const [demoUser, setDemoUser] = useState<User | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const {
    user: auth0User,
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  // Check for existing demo session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("budgetguard_demo_user");
    if (savedUser) {
      setDemoUser(JSON.parse(savedUser));
    }
  }, []);

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
      
      const demoUser: User = {
        id: "demo-user-123",
        email: email,
        name: email.split("@")[0],
        avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=667eea&color=fff`
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
          returnTo: window.location.origin + "/budget-guard-app/budget/login",
        },
      });
    } else {
      setDemoUser(null);
      localStorage.removeItem("budgetguard_demo_user");
    }
  };

  // Auth0 integration methods
  const loginWithAuth0 = async () => {
    await loginWithRedirect({
      authorizationParams: {
        connection: "Username-Password-Authentication",
      },
    });
  };

  const signUpWithAuth0 = async () => {
    await loginWithRedirect({
      authorizationParams: {
        connection: "Username-Password-Authentication",
        screen_hint: "signup",
      },
    });
  };


  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    loginWithAuth0,
    signUpWithAuth0,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
