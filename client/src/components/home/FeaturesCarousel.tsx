import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { PLATFORM_FEATURES } from "@/constants/features";
import { Sparkles, DollarSign, Users, Crown, Edit, TrendingUp } from "lucide-react";

const iconMap = {
  Sparkles,
  DollarSign,
  Users,
  Crown,
  Edit,
  TrendingUp,
};

export const FeaturesCarousel = () => {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground font-serif max-w-2xl mx-auto">
            Powerful features designed to help you create, share, and monetize your content effectively.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {PLATFORM_FEATURES.map((feature, index) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border bg-card">
                    <CardContent className="p-7">
                      <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};
