import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              Explore Categories
            </h1>
            <p className="text-lg text-muted-foreground font-serif max-w-2xl mx-auto">
              Discover articles organized by topics that interest you most
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((category) => (
              <Link
                key={category._id}
                to={`/articles?category=${category._id}`}
                className="group"
              >
                <Card className="h-full border overflow-hidden transition-colors hover:border-foreground/15">
                  <div className="h-1.5 bg-primary" />
                  <CardHeader className="p-8">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                        {category.categoryName}
                      </CardTitle>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </CardHeader>
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
