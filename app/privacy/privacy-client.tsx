"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { IconArrowUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function PrivacyPageClient() {
  const [activeSection, setActiveSection] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 500);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-10 md:py-20 lg:py-24">
        {/* Hero Section */}
        <section className="mb-12 md:mb-16">
          <Heading as="h1" className="mb-4">
            Privacy Policy
          </Heading>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <Subheading className="mb-0">Corteksa CRM</Subheading>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary w-fit">
              Updated January 12, 2026
            </span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
            This Privacy Policy explains how Corteksa CRM collects, uses, stores, and protects
            your personal information in compliance with GDPR, CCPA, and Saudi PDPL.
          </p>
        </section>

        {/* Main Content Layout */}
        <div className="flex gap-12">
          {/* Table of Contents - Sticky Sidebar */}
          <aside className="hidden lg:block w-64 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
            <nav className="pr-8">
              <h4 className="text-sm font-display font-semibold mb-4">Table of Contents</h4>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={cn(
                        "text-sm transition-colors hover:text-primary",
                        activeSection === section.id
                          ? "text-primary font-medium"
                          : "text-neutral-500 dark:text-neutral-400"
                      )}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 max-w-4xl" id="main-content">
            {/* Introduction & Scope */}
            <PrivacySection id="introduction" title="Introduction & Scope">
              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4">1. Introduction</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Corteksa ("Corteksa", "we", "us", or "our") is a Software-as-a-Service (SaaS) Customer Relationship Management (CRM) platform designed to support organizations through configurable, multi-tenant, and data-isolated business management tools.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                This Privacy Policy explains how we collect, use, store, process, disclose, and protect personal data when you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-6">
                <li>Access or use Corteksa CRM</li>
                <li>Create an account or workspace</li>
                <li>Integrate third-party services</li>
                <li>Communicate with us</li>
                <li>Visit our websites or dashboards</li>
              </ul>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg my-6">
                <p className="font-medium mb-2">Important:</p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  By accessing or using Corteksa, you acknowledge that you have read, understood, and agreed to this Privacy Policy.
                </p>
              </div>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">2. Legal Scope & Compliance</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Corteksa complies with the following data protection regulations:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li><strong>GDPR</strong> (General Data Protection Regulation) – EU and EEA users</li>
                <li><strong>CCPA</strong> (California Consumer Privacy Act) – California residents</li>
                <li><strong>PDPL</strong> (Personal Data Protection Law) – Saudi Arabia users</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">3. Definitions</h3>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li><strong>Personal Data</strong>: Any information relating to an identified or identifiable natural person</li>
                <li><strong>Processing</strong>: Any operation performed on personal data (collection, storage, use, disclosure, deletion)</li>
                <li><strong>Data Controller</strong>: The entity determining the purposes and means of processing (typically the Customer/Workspace Owner)</li>
                <li><strong>Data Processor</strong>: The entity processing data on behalf of the Controller (Corteksa acts as a Processor)</li>
                <li><strong>Data Subject</strong>: The individual whose personal data is being processed</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">4. Roles & Responsibilities</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                <strong>Corteksa as Data Processor:</strong> Corteksa processes Customer Data strictly on behalf of the Customer (Data Controller) in accordance with the Customer's instructions.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                <strong>Customer as Data Controller:</strong> Customers who use Corteksa to manage data about their own users, leads, or contacts are Data Controllers and are solely responsible for compliance with applicable data protection laws.
              </p>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">5. Data Protection Principles</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Corteksa adheres to the following core principles:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li><strong>Lawfulness, Fairness, and Transparency</strong>: Data is processed lawfully and transparently</li>
                <li><strong>Purpose Limitation</strong>: Data is collected for specified, legitimate purposes</li>
                <li><strong>Data Minimization</strong>: Only necessary data is collected</li>
                <li><strong>Accuracy</strong>: Data is kept accurate and up-to-date</li>
                <li><strong>Storage Limitation</strong>: Data is not retained longer than necessary</li>
                <li><strong>Integrity & Confidentiality</strong>: Appropriate security measures are in place</li>
                <li><strong>Accountability</strong>: We are responsible for demonstrating compliance</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">6. Age Restrictions</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Corteksa is not intended for use by individuals under the age of 16. We do not knowingly collect personal data from minors. If we become aware that a minor has provided us with personal data, we will take steps to delete it.
              </p>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">7. Policy Updates</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We may update this Privacy Policy periodically. Changes will be effective upon posting, with the "Last Updated" date revised. Continued use of Corteksa after updates constitutes acceptance of the revised policy.
              </p>
            </PrivacySection>

            {/* Data We Collect */}
            <PrivacySection id="data-collection" title="Data We Collect">
              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4">8. Categories of Personal Data</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We collect the following types of personal data:
              </p>
              <h4 className="text-lg font-display font-medium mt-6 mb-3">Account Information</h4>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Full name, email address, phone number</li>
                <li>Company name, job title, department</li>
                <li>Username and encrypted password</li>
                <li>Profile photo (optional)</li>
              </ul>

              <h4 className="text-lg font-display font-medium mt-6 mb-3">Workspace & Usage Data</h4>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Workspace name, subdomain, and configuration settings</li>
                <li>User roles, permissions, and access logs</li>
                <li>Activity logs (logins, feature usage, timestamps)</li>
                <li>IP address, device type, browser type</li>
              </ul>

              <h4 className="text-lg font-display font-medium mt-6 mb-3">Customer Data</h4>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Contact information of leads, customers, and employees entered by the Customer</li>
                <li>Sales pipeline data, notes, documents, and communications</li>
                <li>Custom fields and metadata created by the Customer</li>
              </ul>

              <h4 className="text-lg font-display font-medium mt-6 mb-3">Communication Data</h4>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Email correspondence with support or sales teams</li>
                <li>In-app messages, feedback forms, and support tickets</li>
              </ul>

              <h4 className="text-lg font-display font-medium mt-6 mb-3">Payment & Billing Data</h4>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Billing address, payment method (processed via third-party payment processors)</li>
                <li>Transaction history and invoices</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">9. Sources of Data</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We collect data from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li><strong>Directly from you</strong>: When you register, configure your workspace, or interact with the platform</li>
                <li><strong>Automatically</strong>: Through cookies, logs, and usage analytics</li>
                <li><strong>Third-party integrations</strong>: When you connect external tools (e.g., email, calendars)</li>
                <li><strong>Customer uploads</strong>: Data you manually enter or import into Corteksa</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">10. Lawful Bases for Processing</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We process personal data based on the following legal grounds:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li><strong>Contractual Necessity</strong>: To provide and operate the Corteksa platform</li>
                <li><strong>Consent</strong>: Where you have explicitly agreed (e.g., marketing emails)</li>
                <li><strong>Legitimate Interests</strong>: For platform improvement, fraud prevention, and security</li>
                <li><strong>Legal Obligations</strong>: To comply with applicable laws and regulations</li>
              </ul>
            </PrivacySection>

            {/* How We Use Data */}
            <PrivacySection id="data-usage" title="How We Use Data">
              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4">11. Purpose of Processing</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We use personal data for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li><strong>Service Delivery</strong>: To create accounts, manage workspaces, and provide CRM functionality</li>
                <li><strong>Customer Support</strong>: To respond to inquiries and resolve technical issues</li>
                <li><strong>Billing & Payments</strong>: To process subscription fees and generate invoices</li>
                <li><strong>Platform Improvement</strong>: To analyze usage patterns and develop new features</li>
                <li><strong>Security & Fraud Prevention</strong>: To detect and prevent unauthorized access</li>
                <li><strong>Compliance</strong>: To meet legal and regulatory obligations</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">12. Automated Processing & AI</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Corteksa may use automated tools and AI-driven features for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Predictive analytics (e.g., sales forecasting)</li>
                <li>Lead scoring and prioritization</li>
                <li>Workflow automation and task recommendations</li>
              </ul>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Customers retain control over automated decision-making features and can opt-out or request human review.
              </p>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">13. Cookies & Similar Technologies</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li><strong>Essential Cookies</strong>: Required for authentication and platform functionality</li>
                <li><strong>Analytics Cookies</strong>: To understand usage patterns and improve performance</li>
                <li><strong>Preference Cookies</strong>: To remember user settings and preferences</li>
              </ul>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                You can control cookie preferences through your browser settings.
              </p>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">14. Do Not Track</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Corteksa respects "Do Not Track" (DNT) browser signals where technically feasible. However, some tracking may be necessary for essential platform functionality.
              </p>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">15. Marketing Communications</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We may send promotional emails about new features, updates, and offers. You can opt-out anytime by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Clicking "unsubscribe" in any marketing email</li>
                <li>Updating your communication preferences in account settings</li>
                <li>Contacting support@corteksa.com</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">16. Data Sharing & Disclosure</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We do not sell personal data. We may share data with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li><strong>Service Providers</strong>: Cloud hosting, payment processors, email services (under strict data processing agreements)</li>
                <li><strong>Legal Authorities</strong>: When required by law or to protect our rights</li>
                <li><strong>Business Transfers</strong>: In the event of a merger, acquisition, or sale of assets</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">17. International Transfers</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Corteksa may transfer data internationally. We ensure adequate safeguards through:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                <li>Adequacy decisions by regulatory authorities</li>
                <li>Encryption and secure data transfer protocols</li>
              </ul>
            </PrivacySection>

            {/* Data Management */}
            <PrivacySection id="data-management" title="Data Management">
              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4">18. Data Ownership</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                <strong>Customer Data Ownership:</strong> Customers retain full ownership of all data entered into Corteksa. Corteksa acts solely as a processor.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                <strong>Platform Data:</strong> Corteksa owns aggregated, anonymized usage data used for analytics and improvements.
              </p>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">19. Data Retention Policy</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We retain personal data as follows:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li><strong>Active Accounts</strong>: For the duration of the subscription</li>
                <li><strong>Inactive Accounts</strong>: 90 days after subscription termination (unless legally required to retain longer)</li>
                <li><strong>Billing Records</strong>: 7 years (as required by tax and accounting laws)</li>
                <li><strong>Support Logs</strong>: 2 years</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">20. Data Deletion & Erasure</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Upon account closure or deletion request:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Customer Data is permanently deleted within 30 days</li>
                <li>Backup copies are purged within 90 days</li>
                <li>Some data may be retained for legal compliance (e.g., financial records)</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">21. Backup & Disaster Recovery</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We maintain regular backups to ensure business continuity. Backups are:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Encrypted and stored securely</li>
                <li>Retained for up to 90 days</li>
                <li>Subject to the same security controls as live data</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">22. Data Portability</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                You have the right to export your data in a structured, machine-readable format (e.g., CSV, JSON). Export functionality is available via:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Self-service export tools in the platform</li>
                <li>Request to support@corteksa.com (processed within 30 days)</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">23. Confidentiality & Access Control</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Access to personal data is restricted to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Authorized employees on a need-to-know basis</li>
                <li>Multi-factor authentication (MFA) for admin accounts</li>
                <li>Role-based access control (RBAC) within workspaces</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">24. Data Residency</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Customer data is stored in geographically distributed data centers. Customers may request specific data residency options (subject to availability and additional fees).
              </p>
            </PrivacySection>

            {/* Your Rights */}
            <PrivacySection id="your-rights" title="Your Rights">
              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4">25. Data Subject Rights</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Depending on your jurisdiction, you have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li><strong>Right of Access</strong>: Request a copy of your personal data</li>
                <li><strong>Right to Rectification</strong>: Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure</strong>: Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Right to Restrict Processing</strong>: Limit how we use your data</li>
                <li><strong>Right to Data Portability</strong>: Export your data in a structured format</li>
                <li><strong>Right to Object</strong>: Opt-out of certain processing activities (e.g., marketing)</li>
                <li><strong>Right to Withdraw Consent</strong>: Revoke consent at any time</li>
                <li><strong>Right to Lodge a Complaint</strong>: File a complaint with your data protection authority</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">26. Exercising Your Rights</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                To exercise your rights, contact us at:
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg my-6">
                <p className="font-medium mb-2">Privacy & Compliance Office</p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Email:{" "}
                  <a href="mailto:support@corteksa.com" className="text-primary hover:underline">
                    support@corteksa.com
                  </a>
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                  Product: Corteksa CRM
                  <br />
                  Company: MOONTIJ LLC
                </p>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We will respond to requests within 30 days (or as required by applicable law).
              </p>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">27. Customer Responsibilities</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                If you are a Customer (Data Controller), you are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Obtaining necessary consents from your end-users</li>
                <li>Ensuring lawful processing of data entered into Corteksa</li>
                <li>Responding to data subject requests from your end-users</li>
                <li>Complying with applicable data protection laws</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">28. Rights Under GDPR, CCPA, PDPL</h3>
              <h4 className="text-lg font-display font-medium mt-6 mb-3">GDPR (EU/EEA Users)</h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Full access, rectification, erasure, restriction, portability, and objection rights. Right to lodge complaints with supervisory authorities.
              </p>
              <h4 className="text-lg font-display font-medium mt-6 mb-3">CCPA (California Residents)</h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Right to know, delete, and opt-out of "sale" of personal information (note: Corteksa does not sell personal data).
              </p>
              <h4 className="text-lg font-display font-medium mt-6 mb-3">PDPL (Saudi Arabia Users)</h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Right to access, correction, deletion, and restriction. Right to object to processing and file complaints with the Saudi Data & AI Authority (SDAIA).
              </p>
            </PrivacySection>

            {/* Security */}
            <PrivacySection id="security" title="Security">
              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4">29. Information Security Program</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Corteksa implements a comprehensive Information Security Program based on industry standards (ISO 27001, SOC 2). Our security measures include:
              </p>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">30. Technical Safeguards</h3>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li><strong>Encryption</strong>: Data encrypted at rest (AES-256) and in transit (TLS 1.3)</li>
                <li><strong>Multi-Factor Authentication (MFA)</strong>: Required for admin accounts</li>
                <li><strong>Firewall & Intrusion Detection</strong>: 24/7 monitoring for threats</li>
                <li><strong>Regular Penetration Testing</strong>: Annual security audits and vulnerability scans</li>
                <li><strong>Secure Development Lifecycle</strong>: Security reviews for all code releases</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">31. Organizational Measures</h3>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li><strong>Employee Training</strong>: Mandatory security and privacy training for all staff</li>
                <li><strong>Background Checks</strong>: Screening for employees with data access</li>
                <li><strong>Confidentiality Agreements</strong>: All employees sign NDAs</li>
                <li><strong>Incident Response Plan</strong>: Documented procedures for security incidents</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">32. Access Management</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We enforce strict access controls:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Principle of least privilege (minimum necessary access)</li>
                <li>Regular access reviews and audits</li>
                <li>Immediate revocation upon employee termination</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">33. Incident & Breach Response</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                In the event of a data breach:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>We will investigate and contain the breach within 24 hours</li>
                <li>Affected users will be notified within 72 hours (as required by GDPR)</li>
                <li>Regulatory authorities will be notified as required by law</li>
                <li>We will provide remediation steps and support</li>
              </ul>
            </PrivacySection>

            {/* Additional Terms */}
            <PrivacySection id="additional-terms" title="Additional Terms">
              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4">34. Third-Party Links</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Corteksa may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
              </p>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">35. Children's Privacy</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Corteksa is not directed at individuals under 16 years of age. We do not knowingly collect data from minors. If you believe a minor has provided us with personal data, contact us immediately.
              </p>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">36. Changes to This Policy</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. Material changes will be communicated via:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 ml-4 mb-4">
                <li>Email notification to registered users</li>
                <li>In-app notifications</li>
                <li>Prominent notice on our website</li>
              </ul>
            </PrivacySection>

            {/* Contact & Legal */}
            <PrivacySection id="contact-legal" title="Contact & Legal">
              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4">37. Contact Information</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                For privacy-related inquiries, data subject requests, or security concerns:
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg my-6">
                <p className="font-medium mb-4">Corteksa Privacy & Compliance Office</p>
                <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:support@corteksa.com" className="text-primary hover:underline">
                    support@corteksa.com
                  </a>
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                  <strong>Product:</strong> Corteksa CRM
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                  <strong>Company:</strong> MOONTIJ LLC
                </p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  <strong>Response Time:</strong> Within 30 days
                </p>
              </div>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">38. Governing Law</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                This Privacy Policy is governed by the laws of the jurisdiction in which MOONTIJ LLC is registered, without regard to conflict of law principles. Disputes will be resolved in accordance with the dispute resolution provisions in our Terms of Service.
              </p>

              <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-8">39. Final Legal Statement</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                By using Corteksa CRM, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree, please discontinue use of the platform.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                This Privacy Policy constitutes a binding legal agreement between you and MOONTIJ LLC.
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg my-6">
                <p className="font-medium mb-2">Last Updated: January 12, 2026</p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Effective Date: January 12, 2026
                </p>
              </div>
            </PrivacySection>
          </main>
        </div>

        {/* Back to Top Button */}
        <AnimatePresence>
          {isVisible && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-8 right-8 p-3 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
              aria-label="Back to top"
            >
              <IconArrowUp className="size-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}

// Reusable Section Component
function PrivacySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-8 text-neutral-900 dark:text-neutral-100">
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

// Table of Contents Data
const sections = [
  { id: "introduction", title: "Introduction & Scope" },
  { id: "data-collection", title: "Data We Collect" },
  { id: "data-usage", title: "How We Use Data" },
  { id: "data-management", title: "Data Management" },
  { id: "your-rights", title: "Your Rights" },
  { id: "security", title: "Security" },
  { id: "additional-terms", title: "Additional Terms" },
  { id: "contact-legal", title: "Contact & Legal" },
];
