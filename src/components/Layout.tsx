import { Home, List, Settings, Plus, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/budget" },
    { icon: List, label: "Transactions", path: "/budget/transactions" },
    { icon: Settings, label: "Settings", path: "/budget/settings" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header with User Info */}
      <header className="sticky top-0 z-50 bg-card/95 border-b border-border backdrop-blur-xl card-shadow">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">💰</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">BudgetGuard</h1>
              <p className="text-xs text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 overflow-auto">{children}</main>

      {/* Floating Action Button */}
      <Link to="/budget/add-expense">
        <Button
          size="icon"
          className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg gradient-premium glow-primary hover:scale-110 transition-transform border-0"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 border-t border-border backdrop-blur-xl card-shadow">
        <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 relative"
              >
                <div
                  className={`p-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
