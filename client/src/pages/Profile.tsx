import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Users, FileText, Flag, User } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useEffect, useState } from "react";

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuthStore();
  const isOwnProfile = !userId
    ? true
    : userId === currentUser._id
    ? true
    : false;
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    isOwnProfile
      ? setUser(currentUser)
      : setUser({
          _id: "1",
          name: "Sarah Johnson",
          email: "sarah@johnson.com",
          username: "sarahj",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          bio: "Full-stack developer passionate about web technologies. Writing about React, TypeScript, and modern web development.",
          followersCount: 1250,
          followingCount: 340,
          articlesCount: 45,
          isFollowing: false,
        });
  }, [userId]);

  const mockArticles: IArticle[] = [
    {
      id: "1",
      title: "Getting Started with React and TypeScript",
      description:
        "Learn how to build type-safe React applications using TypeScript.",
      content: "",
      author: user,
      category: {
        id: "1",
        name: "Technology",
        slug: "technology",
        articleCount: 1250,
      },
      tags: ["react", "typescript", "webdev"],
      isPaid: false,
      likes: 234,
      commentsCount: 45,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      readTime: 8,
    },
  ];

  if (!user) {
    return null;
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
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.name}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="border-gray-500 border-4 p-2 rounded-full">
                    <User size={42} className="text-gray-500" />
                  </div>
                )}

                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
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
                  {/* {mockArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))} */}
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
