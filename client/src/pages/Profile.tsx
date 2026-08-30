import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Users, FileText, Flag, User, LogOutIcon } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { getUserByIdService } from "@/api/user";
import { useState } from "react";
import withAuth from "@/hoc/withAuth";

const Profile = () => {
  const { currentUser, setCurrentUser } = useAuthStore();
  const userId = useParams().userId || currentUser?._id || "";
  const isOwnProfile = currentUser?._id === userId ? true : false;
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  
  const { data: user } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (currentUser?._id == userId) {
        return currentUser;
      } else {
        return await getUserByIdService(userId);
      }
    },
  });

  function handleLogout() {
    setCurrentUser(null);
    navigate("/");
  }

  if (!user) {
    return <div>User not found</div>;
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-card rounded-lg p-8 shadow-card mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {user.avatar ? (
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.fullName} />
                    <AvatarFallback className="text-2xl">
                      {user.fullName}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="border-gray-500 border-4 p-2 rounded-full">
                    <User size={42} className="text-gray-500" />
                  </div>
                )}

                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-1">{user.fullName}</h1>
                  <p className="text-muted-foreground mb-2">@{user.username}</p>
                  <p className="text-foreground mb-4">{user.bio}</p>

                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-semibold">
                        {user.followersCount || 0}
                      </span>{" "}
                      <span className="text-muted-foreground">Followers</span>
                    </div>
                    <div>
                      <span className="font-semibold">
                        {user.followingCount || 0}
                      </span>{" "}
                      <span className="text-muted-foreground">Following</span>
                    </div>
                    <div>
                      <span className="font-semibold">
                        {user.articlesCount || 0}
                      </span>{" "}
                      <span className="text-muted-foreground">Articles</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <Button variant="outline" asChild>
                      <Link to="/settings">Edit Profile</Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="default">
                        <Users className="h-4 w-4 mr-2" />
                        Follow
                      </Button>
                      <Button variant="outline" size="icon">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Tabs defaultValue="articles" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="articles">
                  <FileText className="h-4 w-4 mr-2" />
                  Articles
                </TabsTrigger>
                {isOwnProfile && (
                  <TabsTrigger value="followers">
                    <Users className="h-4 w-4 mr-2" />
                    Followers
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="articles" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </TabsContent>

              {isOwnProfile && (
                <TabsContent value="followers" className="mt-6">
                  <p className="text-center text-muted-foreground py-8">
                    Your followers will appear here
                  </p>
                </TabsContent>
              )}
            </Tabs>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-600 text-white font-semibold hover:bg-red-300">
            Logout <LogOutIcon className="font-semibold" />
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default withAuth(Profile);
