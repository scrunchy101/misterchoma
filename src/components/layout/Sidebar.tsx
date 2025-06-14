
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Package2, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  ShoppingBasket,
  Database,
  Menu as MenuIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ModeToggle } from "../theme/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Logo from "../brand/Logo";

interface SidebarProps {
  activeTab?: string;
  setActiveTab: (tab: string) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab,
  setActiveTab,
  expanded = true,
  onToggleExpand
}) => {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const currentPath = location.pathname;

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Menu Items", href: "/menu", icon: Package2 },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Point of Sale", href: "/pos", icon: ShoppingBasket },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Database Test", href: "/database-test", icon: Database },
  ];

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    if (signOut) {
      signOut();
    }
  };

  return (
    <div className={cn(
      "bg-sidebar flex flex-col border-r border-border transition-all duration-300 h-screen",
      expanded ? "w-60" : "w-[70px]"
    )}>
      <div className="p-4 flex items-center justify-between">
        <div className={cn("flex items-center", expanded ? "" : "justify-center w-full")}>
          {expanded ? (
            <div className="flex items-center">
              <Logo size={32} />
              <span className="text-lg font-bold ml-2">Admin</span>
            </div>
          ) : (
            <Logo size={28} />
          )}
        </div>
        {onToggleExpand && (
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("p-0 h-8 w-8", !expanded && "hidden")} 
            onClick={onToggleExpand}
          >
            <MenuIcon size={18} />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = currentPath === item.href || 
                             (item.href !== "/" && currentPath.startsWith(item.href));
            
            return (
              <TooltipProvider key={item.name} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted",
                        !expanded && "justify-center px-2"
                      )}
                      onClick={() => setActiveTab(item.href)}
                    >
                      <item.icon className={cn("h-5 w-5", expanded && "mr-3")} />
                      {expanded && <span>{item.name}</span>}
                    </Link>
                  </TooltipTrigger>
                  {!expanded && (
                    <TooltipContent side="right">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </ScrollArea>

      <div className={cn(
        "p-3 mt-auto border-t border-border",
        expanded ? "flex items-center justify-between" : "flex flex-col items-center space-y-4"
      )}>
        {expanded ? (
          <>
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={(profile as any)?.avatar_url || (user?.user_metadata?.avatar_url as string) || ""} />
                <AvatarFallback>{getInitials((profile as any)?.full_name || (user?.user_metadata?.name as string) || user?.email || "User")}</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-sm font-medium">{(profile as any)?.full_name || (user?.user_metadata?.name as string) || "User"}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {user?.email || ""}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <ModeToggle />
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <Avatar className="h-8 w-8">
              <AvatarImage src={(profile as any)?.avatar_url || (user?.user_metadata?.avatar_url as string) || ""} />
              <AvatarFallback>{getInitials((profile as any)?.full_name || (user?.user_metadata?.name as string) || user?.email || "User")}</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col space-y-2">
              <ModeToggle />
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleLogout}>
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Logout
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
