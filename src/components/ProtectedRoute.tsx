import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log("🔒 ProtectedRoute: isLoading=", isLoading, "isAuthenticated=", isAuthenticated);

  if (isLoading) {
    console.log("⏳ ProtectedRoute: Showing loading skeleton");
    return (
      <div className="min-h-screen p-6 max-w-lg mx-auto space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("🚫 ProtectedRoute: Not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ ProtectedRoute: Authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
