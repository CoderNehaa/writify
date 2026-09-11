import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, FileText, Grid, PenSquare, Crown, Info, Mail, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Home", href: "/", icon: Home },
  { title: "Articles", href: "/articles", icon: FileText },
  { title: "Write Article", href: "/write", icon: PenSquare },
  { title: "Categories", href: "/categories", icon: Grid },
  { title: "Membership", href: "/membership", icon: Crown },
  { title: "About", href: "/about", icon: Info },
  { title: "Contact", href: "/contact", icon: Mail },
  { title: "Privacy", href: "/privacy", icon: Shield },
];

interface SidebarNavProps {
  onNavigate?: () => void;
}

// Shared nav body so the desktop rail and the mobile drawer (Sheet) stay in
// sync instead of maintaining two copies of the same link list.
export const SidebarNav = ({ onNavigate }: SidebarNavProps) => {
  const location = useLocation();

  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors",
              isActive
                ? "bg-secondary text-foreground font-medium border-l-2 border-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
};

// Fixed-width rail — only makes sense once there's room for it alongside
// the article list, so it's hidden below md and swapped for a Sheet-based
// drawer (see MobileNavTrigger) on small screens.
export const LeftSidebar = () => {
  return (
    <div className="hidden md:block w-64 border-r bg-card h-screen sticky top-0">
      <ScrollArea className="h-full">
        <div className="p-4">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 px-3.5">
            Navigation
          </h2>
          <SidebarNav />
        </div>
      </ScrollArea>
    </div>
  );
};
