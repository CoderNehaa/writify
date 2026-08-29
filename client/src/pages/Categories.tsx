import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "1",
    name: "Technology",
    slug: "technology",
    description: "Latest trends in tech and innovation",
    articleCount: 1250,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "2",
    name: "Business",
    slug: "business",
    description: "Entrepreneurship and startups",
    articleCount: 850,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "3",
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Health and wellness",
    articleCount: 620,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "4",
    name: "Education",
    slug: "education",
    description: "Learning and tutorials",
    articleCount: 540,
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "5",
    name: "Health",
    slug: "health",
    description: "Fitness and nutrition",
    articleCount: 480,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "6",
    name: "Travel",
    slug: "travel",
    description: "Destinations and adventures",
    articleCount: 390,
    color: "from-teal-500 to-emerald-500",
  },
  {
    id: "7",
    name: "Food",
    slug: "food",
    description: "Recipes and culinary arts",
    articleCount: 320,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "8",
    name: "Fashion",
    slug: "fashion",
    description: "Style and trends",
    articleCount: 280,
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    id: "9",
    name: "Science",
    slug: "science",
    description: "Research and discoveries",
    articleCount: 450,
    color: "from-indigo-500 to-blue-500",
  },
];

const Categories = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Categories</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover articles organized by topics that interest you most
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/articles?category=${category.slug}`}
                className="group"
              >
                <Card className="h-full hover-lift border-0 overflow-hidden transition-all">
                  <div className={`h-1.5 bg-gradient-to-r ${category.color}`} />
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                    <CardDescription className="text-sm line-clamp-2">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Badge variant="secondary" className="text-xs">
                      {category.articleCount.toLocaleString()}
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
