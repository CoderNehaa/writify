import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, LogOutIcon, Search } from "lucide-react";
import useAuthStore from "@/store/authStore";


export const Header = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const isArticlesPage = location.pathname === "/articles";
  const { currentUser, handleLogout } = useAuthStore();
  const isAuthenticated = currentUser === null ? false : true;
  const navigate = useNavigate();

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-16 w-full flex items-center justify-between gap-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Writify
            </span>
          </Link>
        </div>

        <div className={`flex items-center justify-end w-full gap-4`}>
          {isArticlesPage && (
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search articles..." className="pl-10" />
              </div>
            </div>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback>
                    {currentUser?.username.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <span className="ml-2" onClick={handleLogout}>
                <LogOutIcon />
              </span>
            </>
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
