import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Home, FileText, Grid, PenSquare, Bookmark, Crown, Info, Mail, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeftSidebarProps {
  followingUsers?: IUser[];
}

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

// Mock following users
const mockFollowingUsers: IUser[] = [
  {
    _id: "1",
    name: "Sarah Johnson",
    username: "sarahj",
    email: "sarah@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    isPremium: true,
    createdAt: "2024-01-01",
    followersCount: 1250,
    followingCount: 340,
    articlesCount: 45,
    sharesRemaining: 5,
    articlesPosted: 45,
  },
  {
    _id: "2",
    name: "Michael Chen",
    username: "mchen",
    email: "michael@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    isPremium: false,
    createdAt: "2024-01-01",
    followersCount: 890,
    followingCount: 210,
    articlesCount: 32,
    sharesRemaining: 3,
    articlesPosted: 32,
  },
  {
    _id: "3",
    name: "Emma Williams",
    username: "emmaw",
    email: "emma@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    isPremium: true,
    createdAt: "2024-01-01",
    followersCount: 2100,
    followingCount: 450,
    articlesCount: 78,
    sharesRemaining: 5,
    articlesPosted: 78,
  },
];

export const LeftSidebar = ({ followingUsers = mockFollowingUsers }: LeftSidebarProps) => {
  const location = useLocation();

  return (
    <div className="w-64 border-r bg-card h-screen sticky top-0">
      <ScrollArea className="h-full">
        <div className="p-4">
          <h2 className="font-bold text-lg mb-4">Navigation</h2>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold mb-4">Following ({followingUsers.length})</h3>
            <div className="space-y-3">
              {followingUsers.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user._id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
