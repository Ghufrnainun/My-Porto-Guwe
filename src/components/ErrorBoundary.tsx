import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground animate-in fade-in">
          <div className="bg-card border rounded-lg p-8 max-w-md w-full shadow-lg text-center space-y-4">
            <div className="bg-destructive/10 text-destructive p-3 rounded-full w-fit mx-auto">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground text-sm">
              We encountered an error while rendering this page.
            </p>
            <div className="bg-muted p-4 rounded text-left overflow-auto max-h-32 text-xs font-mono">
              {this.state.error?.message}
            </div>
            <div className="pt-2">
              <Button onClick={this.handleReload} className="w-full">
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
