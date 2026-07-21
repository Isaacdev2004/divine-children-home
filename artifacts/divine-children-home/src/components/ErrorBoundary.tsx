import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, info.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-16">
          <AlertTriangle className="h-12 w-12 text-accent mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-heading font-bold text-primary mb-2">
            {this.props.fallbackTitle ?? "Something went wrong"}
          </h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            We apologise for the inconvenience. Please try again or return to the homepage.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="accent" onClick={this.handleRetry} className="min-h-11">
              Try again
            </Button>
            <Button variant="outline" asChild className="min-h-11">
              <Link href="/">Return home</Link>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
