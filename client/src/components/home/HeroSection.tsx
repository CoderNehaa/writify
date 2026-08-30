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
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6">
            <span className="text-sm font-medium text-primary">
              ✨ Welcome to the Future of Content Creation
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Share Your Ideas,
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Earn from Your Passion
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
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

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">10K+</p>
              <p className="text-sm text-muted-foreground">Active Writers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">50K+</p>
              <p className="text-sm text-muted-foreground">
                Articles Published
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">1M+</p>
              <p className="text-sm text-muted-foreground">Monthly Readers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
