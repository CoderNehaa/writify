import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, Twitter, Linkedin } from "lucide-react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { sendContactMessageService } from "@/api/contact";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: sendContactMessageService,
    onSuccess: (res) => {
      toast.success(res.message || "Message sent! We'll get back to you soon.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      name,
      email,
      message: subject ? `Subject: ${subject}\n\n${message}` : message,
    });
  };

  const scrollToFaq = () => {
    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll respond as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" variant="hero" className="w-full" disabled={isPending}>
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">support@Writify.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {/* TODO: add real Twitter/LinkedIn profile links */}
                    <Button variant="outline" size="icon">
                      <Twitter className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Need immediate assistance?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check our FAQ section for quick answers to common questions.
                  </p>
                  <Button variant="outline" className="w-full" onClick={scrollToFaq}>
                    View FAQ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div id="faq" className="max-w-3xl mx-auto mt-24 pt-12 border-t scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I publish an article?</AccordionTrigger>
                <AccordionContent>
                  Sign in, go to Write Article from the navigation, fill in a title,
                  category, and content, then click Publish Article.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I save an article without publishing it?</AccordionTrigger>
                <AccordionContent>
                  Yes — use Save Draft on the Write Article page. Drafts are only
                  visible to you until you publish them.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                <AccordionContent>
                  Use the "Forgot password?" link on the sign-in page, or change it
                  directly from Settings if you're already logged in.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How do I delete my account?</AccordionTrigger>
                <AccordionContent>
                  Go to Settings and use the Delete Account option in the Danger
                  Zone section.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
