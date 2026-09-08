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

    const isChunkError =
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('Importing a module script failed') ||
      error.message?.includes('error loading dynamically imported module') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      const lastReload = sessionStorage.getItem('chunk_error_reload');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 8000) {
        sessionStorage.setItem('chunk_error_reload', String(now));
        window.location.reload();
      }
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isChunkError =
        this.state.error?.message?.includes('Failed to fetch dynamically imported module') ||
        this.state.error?.message?.includes('Importing a module script failed') ||
        this.state.error?.name === 'ChunkLoadError';

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground animate-in fade-in">
          <div className="bg-card border rounded-lg p-8 max-w-md w-full shadow-lg text-center space-y-4">
            <div className="bg-destructive/10 text-destructive p-3 rounded-full w-fit mx-auto">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">
              {isChunkError ? 'New Version Available' : 'Something went wrong'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isChunkError
                ? 'A new version or component update was loaded. Please reload to display the latest content.'
                : 'We encountered an error while rendering this page.'}
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
