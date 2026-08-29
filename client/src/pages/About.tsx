import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, TrendingUp, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
          <div className="container max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Writify
            </h1>
            <p className="text-xl text-muted-foreground">
              Empowering writers to share their voice and earn from their passion
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Writify was created with a simple yet powerful vision: to provide a platform where 
                writers can freely express their ideas, build meaningful connections with readers, and 
                earn a sustainable income from their creative work.
              </p>

              <p className="text-lg text-muted-foreground mb-8">
                We believe that great content deserves to be rewarded. That's why we've built a platform 
                that puts writers first, offering flexible monetization options, advanced writing tools, 
                and a supportive community of fellow creators.
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-12">
                <div className="bg-gradient-card p-6 rounded-lg shadow-card">
                  <BookOpen className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Quality Content</h3>
                  <p className="text-muted-foreground">
                    We curate and promote high-quality articles that provide real value to readers.
                  </p>
                </div>

                <div className="bg-gradient-card p-6 rounded-lg shadow-card">
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Thriving Community</h3>
                  <p className="text-muted-foreground">
                    Connect with readers and fellow writers who share your interests and passions.
                  </p>
                </div>

                <div className="bg-gradient-card p-6 rounded-lg shadow-card">
                  <TrendingUp className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Fair Monetization</h3>
                  <p className="text-muted-foreground">
                    Earn from your content through multiple revenue streams and keep what you deserve.
                  </p>
                </div>

                <div className="bg-gradient-card p-6 rounded-lg shadow-card">
                  <Heart className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Writer-First</h3>
                  <p className="text-muted-foreground">
                    Our platform is designed with writers in mind, providing tools you actually need.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Whether you're a seasoned writer or just starting out, Writify provides the tools 
                and community support you need to succeed. Join thousands of writers who have already 
                made Writify their home for creative expression and professional growth.
              </p>

              <div className="flex gap-4 justify-center mt-8">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth?mode=signup">Start Writing Today</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
