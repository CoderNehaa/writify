import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Writify, you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
              <p className="text-muted-foreground mb-3">To use certain features of our service, you must register for an account. You agree to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Content Guidelines</h2>
              <p className="text-muted-foreground mb-3">When creating content on Writify, you must not:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Post illegal, harmful, or offensive content</li>
                <li>Violate intellectual property rights</li>
                <li>Spread misinformation or spam</li>
                <li>Harass or bully other users</li>
                <li>Impersonate others or misrepresent affiliations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
              <p className="text-muted-foreground">
                You retain ownership of content you create on Writify. By posting content, you grant us a 
                worldwide, non-exclusive license to use, display, and distribute your content on our platform. 
                Writify and its original content remain our property.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Membership and Payments</h2>
              <p className="text-muted-foreground mb-3">Premium membership terms:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Subscriptions automatically renew unless cancelled</li>
                <li>Refunds are provided according to our refund policy</li>
                <li>We reserve the right to modify pricing with notice</li>
                <li>Writers may monetize content subject to platform fees</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Limitations</h2>
              <p className="text-muted-foreground mb-3">Free accounts are subject to limitations:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Maximum 10 articles per account</li>
                <li>5 article shares per month</li>
                <li>3 daily title recommendations</li>
                <li>Limited access to premium features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Reporting and Moderation</h2>
              <p className="text-muted-foreground">
                We rely on our community to report inappropriate content. Reported articles may be reviewed 
                and removed if they violate our guidelines. Multiple reports may affect content visibility 
                and user standing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate accounts that violate these terms. You may 
                delete your account at any time through settings. Upon termination, your right to use the 
                service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Disclaimer</h2>
              <p className="text-muted-foreground">
                Writify is provided "as is" without warranties of any kind. We do not guarantee 
                uninterrupted access or error-free service. We are not liable for any content posted by users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these terms from time to time. Continued use of the service after changes 
                constitutes acceptance of the new terms. We will notify users of significant changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these terms, please contact us at legal@Writify.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
