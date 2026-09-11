import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, PenLine } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { ROUTES_PATH } from "@/utils/routesPath";

export const HeroSection = () => {
  const { currentUser } = useAuthStore();

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 mb-6">
            <span className="text-sm font-medium text-muted-foreground">
              ✨ Welcome to the Future of Content Creation
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6">
            Share Your Ideas,
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Earn from Your Passion
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-serif mb-8 max-w-2xl mx-auto">
            Join thousands of writers who are building their audience, sharing
            knowledge, and monetizing their content on Writify.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" asChild className="min-w-[200px]">
              <Link to={ROUTES_PATH.ARTICLE.ROOT}>
                <BookOpenCheck className="h-5 w-5" />
                Explore Articles
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="min-w-[200px]"
            >
              <Link
                to={
                  currentUser
                    ? ROUTES_PATH.ARTICLE.WRITE
                    : ROUTES_PATH.AUTH.LOGIN
                }
              >
                <PenLine className="h-5 w-5" />
                Start Writing
              </Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto border-t border-border pt-10">
            <div className="text-center">
              <p className="font-serif text-4xl font-semibold text-foreground">10K+</p>
              <p className="text-sm text-muted-foreground mt-1">Active Writers</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-4xl font-semibold text-foreground">50K+</p>
              <p className="text-sm text-muted-foreground mt-1">
                Articles Published
              </p>
            </div>
            <div className="text-center">
              <p className="font-serif text-4xl font-semibold text-foreground">1M+</p>
              <p className="text-sm text-muted-foreground mt-1">Monthly Readers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
