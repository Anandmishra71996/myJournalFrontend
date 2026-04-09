import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Journaling App",
  description: "Learn about how we collect, use, and protect your personal information",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Header */}
      <header className="border-b border-[var(--color-outline)]">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            ← Back to Home
          </Link>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Last Updated: April 8, 2026
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              Introduction
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Welcome to Journaling App ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and web services (collectively, the "Service").
            </p>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              1. Information We Collect
            </h2>
            
            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              1.1 Personal Information
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              When you register for an account, we collect:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Email address</li>
              <li>Name (if provided)</li>
              <li>Password (encrypted)</li>
              <li>Profile picture (optional)</li>
            </ul>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              1.2 Authentication Data
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              If you choose to authenticate using third-party services, we collect:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Google OAuth: Email address, name, profile picture</li>
              <li>Facebook Login: Email address, name, profile picture</li>
            </ul>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              1.3 Journal Content
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              We collect and store:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Journal entries and notes</li>
              <li>Goals and progress tracking data</li>
              <li>Templates you create or use</li>
              <li>AI chat conversations</li>
              <li>Mood and emotion data</li>
              <li>Voice recordings (if you use voice journaling features)</li>
            </ul>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              1.4 Payment Information
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              For subscription payments, we use third-party payment processors (Stripe and Razorpay). We collect:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Billing address</li>
              <li>Subscription tier and billing cycle</li>
              <li>Payment method type (we do NOT store full credit card numbers)</li>
              <li>Transaction history</li>
            </ul>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              1.5 Usage Data
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              We automatically collect:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Device information (device type, operating system, browser type)</li>
              <li>IP address and general location data</li>
              <li>App usage statistics (features used, session duration)</li>
              <li>Error logs and crash reports</li>
              <li>Push notification tokens (for sending you notifications)</li>
            </ul>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              1.6 Cookies and Similar Technologies
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              We use cookies and local storage to:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Keep you signed in</li>
              <li>Remember your preferences</li>
              <li>Analyze app performance</li>
              <li>Provide personalized content</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              2. How We Use Your Information
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              We use the collected information for:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li><strong>Providing Services:</strong> To create and manage your account, store your journal entries, and provide AI-powered insights</li>
              <li><strong>Personalization:</strong> To customize your experience and provide relevant recommendations</li>
              <li><strong>AI Features:</strong> To process your journal entries and generate insights, suggestions, and responses to your chat queries</li>
              <li><strong>Communication:</strong> To send you service updates, security alerts, and subscription notifications</li>
              <li><strong>Payment Processing:</strong> To process your subscription payments and manage billing</li>
              <li><strong>Analytics:</strong> To understand how users interact with our Service and improve functionality</li>
              <li><strong>Security:</strong> To detect, prevent, and address technical issues, fraud, and security breaches</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              3. AI Processing and Data Usage
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Our AI-powered features analyze your journal entries to provide insights, suggestions, and conversational responses. Important notes:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li><strong>Private Processing:</strong> Your journal content is processed solely for your personal insights and is NOT used to train public AI models</li>
              <li><strong>No Sharing:</strong> We do not sell, rent, or share your journal content with third parties for their marketing purposes</li>
              <li><strong>AI Providers:</strong> We may use third-party AI services (such as OpenAI or Google) to process your data. These providers are bound by strict data processing agreements</li>
              <li><strong>Encryption:</strong> All journal content is encrypted in transit and at rest</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              4. Data Sharing and Disclosure
            </h2>
            
            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              4.1 Third-Party Service Providers
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              We share your information with trusted third-party service providers who help us operate our Service:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li><strong>Google Cloud Platform:</strong> Cloud hosting and infrastructure</li>
              <li><strong>Firebase:</strong> Authentication and push notifications</li>
              <li><strong>Stripe & Razorpay:</strong> Payment processing</li>
              <li><strong>AI Service Providers:</strong> Natural language processing and insights generation</li>
            </ul>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              These providers have access to your data only to perform specific tasks on our behalf and are obligated not to disclose or use it for other purposes.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              4.2 Legal Requirements
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              We may disclose your information if required by law or in response to:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Valid legal requests (court orders, subpoenas)</li>
              <li>Protection of our rights, property, or safety</li>
              <li>Prevention of fraud or security issues</li>
              <li>Emergency situations involving danger to persons</li>
            </ul>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              4.3 Business Transfers
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              If we are involved in a merger, acquisition, or asset sale, your information may be transferred. We will provide notice before your information is transferred and becomes subject to a different privacy policy.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              4.4 No Sale of Personal Data
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              We DO NOT sell, rent, or trade your personal information or journal content to third parties for marketing purposes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              5. Data Security
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li><strong>Encryption:</strong> All data is encrypted in transit (TLS/SSL) and at rest (AES-256)</li>
              <li><strong>Authentication:</strong> Secure password hashing and optional two-factor authentication</li>
              <li><strong>Access Controls:</strong> Strict access controls and monitoring of our systems</li>
              <li><strong>Regular Audits:</strong> Regular security audits and vulnerability assessments</li>
              <li><strong>Secure Infrastructure:</strong> Hosting on enterprise-grade cloud platforms with robust security</li>
            </ul>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              6. Data Retention
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              We retain your information for different periods depending on the type of data:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li><strong>Account Information:</strong> Retained while your account is active and for up to 30 days after deletion</li>
              <li><strong>Journal Entries:</strong> Retained until you delete them or close your account</li>
              <li><strong>Payment Data:</strong> Retained for tax and accounting purposes (typically 7 years)</li>
              <li><strong>Usage Data:</strong> Aggregated and anonymized data may be retained indefinitely for analytics</li>
            </ul>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              After account deletion, we permanently remove your personal information within 30 days, except where we are legally required to retain it.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              7. Your Rights and Choices
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Depending on your location, you have certain rights regarding your personal information:
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              7.1 Access and Portability
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              You can access and export your data at any time through your account settings. We provide your data in a commonly used, machine-readable format.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              7.2 Correction and Update
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              You can update your personal information, journal entries, and preferences directly in the app.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              7.3 Deletion
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              You can delete individual journal entries, goals, or your entire account from your profile settings. Upon account deletion, all personal data is permanently removed within 30 days.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              7.4 Marketing Communications
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              You can opt out of marketing emails by clicking the "unsubscribe" link in any promotional email or adjusting your notification preferences in the app.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              7.5 Push Notifications
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              You can disable push notifications through your device settings or in-app notification preferences.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              7.6 California Privacy Rights (CCPA)
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              If you are a California resident, you have additional rights including:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              7.7 European Privacy Rights (GDPR)
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              If you are in the European Economic Area (EEA), you have additional rights including:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              8. Children's Privacy
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Our Service is not intended for children under the age of 13 (or 16 in the EEA). We do not knowingly collect personal information from children under these ages. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we discover that we have collected personal information from a child under the applicable age without parental consent, we will take steps to delete that information from our servers.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              9. International Data Transfers
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Your information may be transferred to and maintained on servers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our Service, you consent to the transfer of your information to our facilities and to the third parties with whom we share it as described in this Privacy Policy.
            </p>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              We take appropriate measures to ensure that your data is treated securely and in accordance with this Privacy Policy, including using Standard Contractual Clauses approved by the European Commission for transfers from the EEA.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              10. Third-Party Links
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read the privacy policies of every website you visit.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              We may update our Privacy Policy from time to time. We will notify you of any changes by:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last Updated" date at the top of this policy</li>
              <li>Sending you an email notification (for material changes)</li>
              <li>Displaying an in-app notification</li>
            </ul>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              You are advised to review this Privacy Policy periodically for any changes. Changes are effective when posted on this page. Continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              12. Contact Us
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="mt-4 rounded-lg bg-[var(--color-surface-variant)] p-6">
              <p className="text-[var(--color-text-secondary)]">
                <strong>Email:</strong> privacy@journalingapp.com
              </p>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                <strong>Data Protection Officer:</strong> dpo@journalingapp.com
              </p>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                <strong>Response Time:</strong> We will respond to your request within 30 days
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              13. Consent
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              By using our Service, you consent to our Privacy Policy and agree to its terms. If you do not agree with this policy, please do not use our Service.
            </p>
          </section>

          {/* Footer Navigation */}
          <div className="mt-12 flex flex-wrap gap-4 border-t border-[var(--color-outline)] pt-8">
            <Link
              href="/"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Pricing
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
