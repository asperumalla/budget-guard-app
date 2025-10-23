import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  // Auth0 integration methods (for future use)
  loginWithAuth0: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage for existing session
        const savedUser = localStorage.getItem("budgetguard_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password
      const demoUser: User = {
        id: "demo-user-123",
        email: email,
        name: email.split("@")[0],
        avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=667eea&color=fff`
      };
      
      setUser(demoUser);
      localStorage.setItem("budgetguard_user", JSON.stringify(demoUser));
    } catch (error) {
      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("budgetguard_user");
  };

  // Auth0 integration methods (placeholder for future implementation)
  const loginWithAuth0 = async () => {
    // TODO: Implement Auth0 login
    console.log("Auth0 login - to be implemented");
    throw new Error("Auth0 integration not yet implemented");
  };

  const loginWithGoogle = async () => {
    // TODO: Implement Google OAuth
    console.log("Google login - to be implemented");
    throw new Error("Google OAuth not yet implemented");
  };

  const loginWithGitHub = async () => {
    // TODO: Implement GitHub OAuth
    console.log("GitHub login - to be implemented");
    throw new Error("GitHub OAuth not yet implemented");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    loginWithAuth0,
    loginWithGoogle,
    loginWithGitHub,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
