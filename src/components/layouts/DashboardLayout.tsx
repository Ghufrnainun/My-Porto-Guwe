import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    {
      label: 'Overview',
      icon: LayoutDashboard,
      href: '/admin',
    },
    {
      label: 'Posts',
      icon: FileText,
      href: '/admin', // Initially pointing to same dashboard, can be separated later
    },
    // Add more items here as needed
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {isSidebarOpen ? (
            <Link
              to="/"
              className="font-display font-bold text-xl tracking-tight"
            >
              Portoku<span className="text-primary">.</span>
            </Link>
          ) : (
            <Link
              to="/"
              className="font-display font-bold text-xl tracking-tight mx-auto"
            >
              P<span className="text-primary">.</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-auto hidden md:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <ChevronRight className="h-4 w-4 rotate-180" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group',
                location.pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  location.pathname === item.href && 'text-primary'
                )}
              />
              {isSidebarOpen && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
              {!isSidebarOpen && (
                <div className="absolute left-16 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md border">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-border mt-auto">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-2 hover:bg-muted"
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.email?.[0]?.toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="text-sm font-medium truncate w-full text-left">
                        Admin
                      </span>
                      <span className="text-xs text-muted-foreground truncate w-full text-left">
                        {user?.email}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.email?.[0]?.toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  side="right"
                  className="w-56 ml-2"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    {user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300 ease-in-out p-8',
          isSidebarOpen ? 'ml-64' : 'ml-20'
        )}
      >
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
