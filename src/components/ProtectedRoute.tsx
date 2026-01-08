import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in -> Redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Logged in but not admin -> Show Access Denied (or redirect)
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-4 bg-background">
        <h1 className="text-4xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground max-w-md">
          You do not have administrative privileges to access this area.
        </p>
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          User ID: {user.id}
        </div>
      </div>
    );
  }

  // Authorized -> Render child routes
  return <Outlet />;
}
