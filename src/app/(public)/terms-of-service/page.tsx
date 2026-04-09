import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Journaling App",
  description: "Terms and conditions for using our journaling application",
};

export default function TermsOfServicePage() {
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
            Terms of Service
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
              Agreement to Terms
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              These Terms of Service ("Terms") govern your access to and use of the Journaling App mobile application and web services (collectively, the "Service"), operated by Journaling App ("we," "us," or "our").
            </p>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              1. Eligibility
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              You must be at least 13 years old (or 16 in the European Economic Area) to use our Service. By using the Service, you represent and warrant that:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>You meet the minimum age requirement</li>
              <li>You have the legal capacity to enter into these Terms</li>
              <li>You will not use the Service for any illegal or unauthorized purpose</li>
              <li>Your use will comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              2. Account Registration
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              To access certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              We reserve the right to suspend or terminate your account if any information provided is inaccurate, not current, or incomplete.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              3. Subscription and Payment
            </h2>
            
            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              3.1 Subscription Tiers
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              We offer three subscription tiers: Free, Reflect, and Thrive. Each tier provides different features and usage limits as described on our pricing page.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              3.2 Billing
            </h3>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Paid subscriptions are billed in advance on a monthly or yearly basis</li>
              <li>Payment is processed through our third-party payment processors (Stripe or Razorpay)</li>
              <li>You authorize us to charge your payment method for all fees incurred</li>
              <li>All fees are non-refundable unless otherwise stated or required by law</li>
            </ul>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              3.3 Auto-Renewal
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              Your subscription will automatically renew at the end of each billing period unless you cancel before the renewal date. You can cancel your subscription at any time from your account settings.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              3.4 Price Changes
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              We reserve the right to modify our pricing. We will provide at least 30 days' notice before any price change takes effect. Continued use of the Service after a price change constitutes acceptance of the new price.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              3.5 Refund Policy
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              We offer a 7-day money-back guarantee for annual subscriptions. Monthly subscriptions are non-refundable. If you're not satisfied within 7 days of purchasing an annual plan, contact us for a full refund.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              4. User Content
            </h2>
            
            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              4.1 Your Content
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              You retain all rights to the content you create, upload, or store in the Service ("User Content"), including journal entries, goals, and templates.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              4.2 License to Us
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              By submitting User Content, you grant us a limited, non-exclusive, royalty-free license to:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Store and backup your content</li>
              <li>Process your content to provide AI-powered insights and features</li>
              <li>Display your content back to you across devices</li>
            </ul>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              This license is solely for operating and improving the Service. We do not use your User Content for marketing or share it with third parties except as required to provide the Service or as required by law.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              4.3 Content Responsibility
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              You are solely responsible for your User Content. You represent and warrant that:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>You own or have the necessary rights to your User Content</li>
              <li>Your content does not violate any laws or these Terms</li>
              <li>Your content does not infringe on third-party rights</li>
            </ul>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              4.4 Content Backup
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              While we regularly backup data, you are responsible for maintaining your own backups. We recommend regularly exporting your journal entries.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              5. Prohibited Conduct
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              You agree not to:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Violate the rights of others, including privacy and intellectual property rights</li>
              <li>Transmit viruses, malware, or other malicious code</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems (bots, scrapers) without our permission</li>
              <li>Impersonate any person or entity</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Circumvent usage limits or access restrictions</li>
              <li>Reverse engineer or attempt to extract source code</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              6. AI-Powered Features
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Our Service includes AI-powered features for insights, suggestions, and chat. You acknowledge that:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>AI-generated content is for informational purposes only</li>
              <li>AI suggestions should not be considered professional advice (medical, legal, financial, etc.)</li>
              <li>AI may occasionally produce inaccurate or inappropriate content</li>
              <li>You use AI features at your own discretion and risk</li>
              <li>We are not liable for decisions made based on AI-generated content</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              7. Intellectual Property
            </h2>
            
            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              7.1 Our Rights
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              The Service, including its design, features, text, graphics, logos, and software, is owned by us and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our permission.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              7.2 Trademarks
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              "Journaling App" and our logo are trademarks. You may not use these marks without our prior written permission.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              8. Third-Party Services
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Our Service integrates with third-party services including:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Google OAuth for authentication</li>
              <li>Facebook Login for authentication</li>
              <li>Stripe and Razorpay for payment processing</li>
              <li>Cloud hosting providers</li>
            </ul>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              We are not responsible for third-party services. Your use of third-party services is subject to their own terms and privacy policies.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              9. Disclaimer of Warranties
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties of uninterrupted or error-free service</li>
              <li>Warranties regarding the accuracy of AI-generated content</li>
              <li>Warranties that the Service will meet your requirements</li>
            </ul>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              We do not guarantee that the Service will be available at all times or free from defects, viruses, or other harmful components.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              10. Limitation of Liability
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Loss of profits, data, or use</li>
              <li>Business interruption</li>
              <li>Loss of goodwill or reputation</li>
              <li>Procurement of substitute services</li>
            </ul>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              Our total liability for all claims related to the Service shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              11. Indemnification
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              You agree to indemnify and hold us harmless from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>Your use of the Service</li>
              <li>Your User Content</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another person or entity</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              12. Termination
            </h2>
            
            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              12.1 By You
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              You may terminate your account at any time from your account settings. Upon termination, your data will be deleted within 30 days as described in our Privacy Policy.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              12.2 By Us
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              We may suspend or terminate your access to the Service at any time, with or without cause or notice, including if:
            </p>
            <ul className="mt-2 list-disc pl-6 text-[var(--color-text-secondary)]">
              <li>You violate these Terms</li>
              <li>Your account has been inactive for an extended period</li>
              <li>We are required to do so by law</li>
              <li>We decide to discontinue the Service</li>
            </ul>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              12.3 Effect of Termination
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              Upon termination, your right to use the Service will immediately cease. We are not liable for any loss or damage resulting from termination.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              13. Dispute Resolution
            </h2>
            
            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              13.1 Informal Resolution
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              Before filing a claim, you agree to contact us to attempt to resolve the dispute informally. We will attempt to resolve disputes within 60 days.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              13.2 Arbitration
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              If informal resolution fails, disputes will be resolved through binding arbitration rather than in court, except where prohibited by law. You waive your right to a jury trial.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              13.3 Class Action Waiver
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              You agree to resolve disputes on an individual basis only. You waive your right to participate in class actions, class arbitrations, or representative actions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              14. General Provisions
            </h2>
            
            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              14.1 Governing Law
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              14.2 Changes to Terms
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              We reserve the right to modify these Terms at any time. We will notify you of material changes via email or in-app notification at least 30 days before they take effect. Continued use after changes constitutes acceptance.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              14.3 Severability
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full effect.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              14.4 Entire Agreement
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the Service.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              14.5 Assignment
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              You may not assign or transfer these Terms. We may assign our rights and obligations without restriction.
            </p>

            <h3 className="mb-3 mt-6 text-xl font-semibold text-[var(--color-text-primary)]">
              14.6 Waiver
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              Our failure to enforce any provision does not constitute a waiver of that provision.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              15. Contact Information
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="mt-4 rounded-lg bg-[var(--color-surface-variant)] p-6">
              <p className="text-[var(--color-text-secondary)]">
                <strong>Email:</strong> legal@journalingapp.com
              </p>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                <strong>Support:</strong> support@journalingapp.com
              </p>
            </div>
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
              href="/privacy-policy"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
