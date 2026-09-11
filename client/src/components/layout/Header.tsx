import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  LogOutIcon,
  Moon,
  Search,
  Settings as SettingsIcon,
  Sun,
  User,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const isArticlesPage = location.pathname === "/articles";
  const { currentUser, handleLogout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const isAuthenticated = currentUser === null ? false : true;
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set("search", value);
    } else {
      next.delete("search");
    }
    setSearchParams(next, { replace: true });
  }, 400);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Both side columns are `minmax(0,1fr)` — forced equal width to each
          other regardless of their own content — with the search column
          sized to its content (capped at 42rem) in between. That's what
          actually centers the search bar on the page: centering it inside
          an `auto`-vs-`auto` gap (the previous version) only centers it
          between whatever the logo and auth-actions happen to measure,
          which drifts off true-center whenever those two differ in width. */}
      <div className="container h-16 w-full grid grid-cols-[minmax(0,1fr)_minmax(0,42rem)_minmax(0,1fr)] items-center gap-2 sm:gap-4">
        <div className="min-w-0">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <BookOpen className="h-6 w-6 text-primary shrink-0" />
            <span className="font-serif text-2xl font-semibold tracking-tight bg-gradient-hero bg-clip-text text-transparent whitespace-nowrap">
              Writify
            </span>
          </Link>
        </div>

        <div className="flex justify-center min-w-0">
          {isArticlesPage && (
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10"
                  value={searchInput}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 flex items-center justify-end gap-1 sm:gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Open account menu"
                  className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback>
                      {currentUser?.username.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="truncate">
                  {currentUser?.fullName || currentUser?.username}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {/* preventDefault keeps the menu open so the user can flip
                    back and forth without reopening it each time */}
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleTheme();
                  }}
                >
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleLogout()}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={
                  theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
                aria-pressed={theme === "dark"}
              >
                {theme === "dark" ? (
                  <Sun className="h-[1.15rem] w-[1.15rem]" />
                ) : (
                  <Moon className="h-[1.15rem] w-[1.15rem]" />
                )}
              </Button>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="sm" className="sm:h-10 sm:px-4 sm:py-2" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="accent" size="sm" className="sm:h-10 sm:px-4 sm:py-2" asChild>
                  <Link to="/auth?mode=signup">Get Started</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
