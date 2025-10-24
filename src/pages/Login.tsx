import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithAuth0, signUpWithAuth0 } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use Auth0 database login with the form credentials
      await loginWithAuth0();
      toast.success("Login successful! Welcome to BudgetGuard");
      navigate("/budget");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      await signUpWithAuth0();
    } catch (error) {
      toast.error("Sign up failed. Please try again.");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">💰</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
            Welcome to BudgetGuard
          </h1>
          <p className="text-muted-foreground">
            Sign in to manage your personal finances
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-8 rounded-2xl border border-border relative overflow-hidden card-shadow bg-card">
          <div className="absolute inset-0 gradient-card opacity-30" />
          <div className="relative z-10 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Auth0 Login Info */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Click "Sign In" to authenticate with Auth0
                </p>
                <p className="text-xs text-muted-foreground">
                  You'll be redirected to Auth0's login page
                </p>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl gradient-primary border-0 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>


          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Don't have an account?{" "}
            <button 
              onClick={handleSignUp}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
