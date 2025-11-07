import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch React errors and display a user-friendly error page
 * Prevents the entire app from crashing and provides error recovery options
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
    
    // In production, you could send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Reload the page to ensure clean state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Something went wrong</h1>
            </div>
            
            <p className="text-muted-foreground">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm font-mono text-destructive break-all">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-sm cursor-pointer text-muted-foreground">
                      Stack trace
                    </summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-40 text-muted-foreground">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <Button onClick={this.handleReset} className="flex-1">
                Reload Page
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = "/app/login"}
                className="flex-1"
              >
                Go to Login
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

