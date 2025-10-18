import { Home, List, Settings, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: List, label: "Transactions", path: "/transactions" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <main className="flex-1 overflow-auto">{children}</main>

      {/* Floating Action Button */}
      <Link to="/add-expense">
        <Button
          size="icon"
          className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg glow-purple hover:scale-110 transition-transform"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-lg bg-card/80">
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
