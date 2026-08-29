import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Search, User } from "lucide-react";
import useAuthStore from "@/store/authStore";

export const Header = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const isArticlesPage = location.pathname === "/articles";
  const { currentUser } = useAuthStore();
  const isAuthenticated = !!currentUser;

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Writify
          </span>
        </Link>

        {isArticlesPage && (
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-10" />
            </div>
          </div>
        )}

        <div
          className={`flex items-center gap-4 flex-shrink-0 ${
            !isArticlesPage ? "ml-auto" : ""
          }`}
        >
          {isAuthenticated ? (
            <Link to="/profile">
              {currentUser.avatar ? (
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {currentUser.name}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="border-gray-500 border-2 p-1 rounded-full">
                  <User size={18} className="text-gray-500" />
                </div>
              )}
            </Link>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button variant="accent" asChild>
                <Link to="/auth?mode=signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
