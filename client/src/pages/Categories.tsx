import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesService } from "@/api/category";

const Categories = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories-all"],
    queryFn: () => getCategoriesService(),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Categories
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover articles organized by topics that interest you most
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={`/articles?category=${category.categoryName}`}
                className="group"
              >
                <Card className="h-full hover-lift border-0 overflow-hidden transition-all">
                  <div className={`h-1.5 bg-gradient-to-r`} />
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {category.categoryName}
                      </CardTitle>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                    {/* <CardDescription className="text-sm line-clamp-2">
                      {category.description}
                    </CardDescription> */}
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Badge variant="secondary" className="text-xs">
                      {category.articleCount || 0} Articles
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
