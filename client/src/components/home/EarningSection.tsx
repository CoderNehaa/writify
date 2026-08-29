import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";

const earningMethods = [
  {
    icon: DollarSign,
    title: "Paid Articles",
    description: "Set your own price for premium content and earn directly from readers",
  },
  {
    icon: Users,
    title: "Build Your Audience",
    description: "Grow your follower base and increase your earning potential",
  },
  {
    icon: TrendingUp,
    title: "Trending Rewards",
    description: "Get featured on trending pages and reach more readers",
  },
  {
    icon: Award,
    title: "Premium Memberships",
    description: "Offer exclusive content to your premium subscribers",
  },
];

export const EarningSection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 mb-6">
              <DollarSign className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Monetization</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Turn Your Writing into Income
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Writify provides multiple ways to monetize your content. From paid articles 
              to premium memberships, you have full control over how you earn.
            </p>
            
            <Button variant="accent" size="lg" asChild>
              <Link to="/membership">
                Explore Membership Plans
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {earningMethods.map((method, index) => (
              <Card key={index} className="hover-lift shadow-card border-0 bg-gradient-card">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <method.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{method.title}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
