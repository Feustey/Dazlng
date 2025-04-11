"use client";

import { useTranslations } from "next-intl";
import PageContainer from "@/app/components/layout/PageContainer";
import Card from "@/app/components/ui/card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/card";
import {
  BookOpen,
  MessageSquare,
  Video,
  HelpCircle,
  FileText,
  ChevronRight,
  Zap,
  Shield,
  Settings,
  ChevronDown,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Globe,
  Info,
  Link2,
  Briefcase,
  PhoneCall,
} from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
  const t = useTranslations("Help");
  const [activeSection, setActiveSection] = useState("resources");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const sections = [
    {
      id: "resources",
      title: "Resources",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "faq",
      title: "FAQ",
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      id: "alby",
      title: "Alby Extension",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: "contact",
      title: "Contact",
      icon: <MessageSquare className="w-5 h-5" />,
    },
  ];

  const resources = [
    {
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      title: "Documentation",
      description:
        "Explore our comprehensive documentation to learn more about DazLng and the Lightning Network.",
      link: "/docs",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-secondary" />,
      title: "Community Forum",
      description:
        "Join our active community to ask questions and share your experiences.",
      link: "/community",
    },
    {
      icon: <Video className="w-6 h-6 text-accent" />,
      title: "Video Tutorials",
      description: "Learn how to use DazLng with our detailed video tutorials.",
      link: "/tutorials",
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: "FAQ",
      description:
        "Find answers to the most frequently asked questions about DazLng.",
      link: "/faq",
    },
  ];

  const faqItems = [
    {
      question: "How do I set up my first Lightning node?",
      answer:
        "Follow our step-by-step setup guide in the documentation. We'll guide you through the entire process, from installation to operation.",
    },
    {
      question: "What are the benefits of using DazLng?",
      answer:
        "DazLng offers an intuitive interface, advanced analytics tools, enhanced security, and active community support for managing your Lightning node.",
    },
    {
      question: "How can I optimize my payment channels?",
      answer:
        "Our optimization algorithm analyzes the network in real-time to suggest the best channel configurations and maximize your earnings.",
    },
    {
      question: "What is DazLng's security policy?",
      answer:
        "Security is our top priority. We use advanced encryption protocols and automatic backups to protect your assets.",
    },
  ];

  const albyFeatures = [
    {
      icon: <Zap className="w-5 h-5 text-primary" />,
      title: "Lightning Network Wallet",
      description: "Manage your sats and make instant payments",
    },
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: "Nostr Key Management",
      description: "Manage your Nostr keys for a secure Web3 experience",
    },
    {
      icon: <Settings className="w-5 h-5 text-primary" />,
      title: "One-Click Login",
      description: "Easily connect to Bitcoin applications",
    },
  ];

  return (
    <PageContainer
      title="Help Center"
      subtitle="Find answers to your questions and learn how to use DazLng"
    >
      {/* Navigation Sections */}
      <div className="flex flex-wrap gap-4 mb-8">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeSection === section.id
                ? "bg-primary/20 text-primary"
                : "bg-gray-800/50 text-gray-300 hover:bg-gray-800"
            }`}
          >
            {section.icon}
            {section.title}
          </button>
        ))}
      </div>

      {/* Section Resources */}
      {activeSection === "resources" && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gradient">
              Help Resources
            </CardTitle>
            <CardDescription className="text-gray-300">
              Explore our various resources to help you use DazLng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.link}
                  className="group block p-6 rounded-lg border border-gray-800 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gradient group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-gray-300 mt-1">
                        {resource.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section FAQ */}
      {activeSection === "faq" && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gradient">
              Frequently Asked Questions
            </CardTitle>
            <CardDescription className="text-gray-300">
              Find answers to the most common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-800 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gradient text-left">
                      {item.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="p-6 bg-gray-800/50">
                      <p className="text-gray-300">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Alby */}
      {activeSection === "alby" && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gradient">
              Alby Extension
            </CardTitle>
            <CardDescription className="text-gray-300">
              Learn how to use the Alby extension with DazLng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="prose dark:prose-invert">
                <p>
                  The Alby extension is a Bitcoin and Lightning Network wallet
                  for your browser. It allows you to:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {albyFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg border border-gray-800 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gradient">
                          {feature.title}
                        </h3>
                        <p className="text-gray-300 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gradient">
                  Installation
                </h3>
                <p className="text-gray-300">To install the Alby extension:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>
                    Visit the{" "}
                    <a
                      href="https://getalby.com/products/browser-extension"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      official Alby website
                    </a>
                  </li>
                  <li>Choose your browser (Chrome, Firefox, etc.)</li>
                  <li>Click "Install"</li>
                  <li>Follow the installation instructions</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gradient">
                  Using with DazLng
                </h3>
                <p className="text-gray-300">
                  Once Alby is installed, you can:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Log in to DazLng with one click</li>
                  <li>Make Lightning payments</li>
                  <li>Manage your Lightning node</li>
                  <li>Use Bitcoin Web3 applications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Contact */}
      {activeSection === "contact" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gradient">
              Need Additional Help?
            </CardTitle>
            <CardDescription className="text-gray-300">
              Our support team is here to help you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gradient">
                  Contact Us
                </h3>
                <p className="text-gray-300">
                  If you can't find an answer to your question in our resources,
                  don't hesitate to contact us. Our support team is available to
                  help you.
                </p>
                <a
                  href="mailto:support@dazlng.com"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  support@dazlng.com
                </a>
              </div>
              <div className="flex items-center justify-center">
                <HelpCircle className="w-32 h-32 text-primary/20" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invitation Box */}
      <div className="mt-12 p-8 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gradient mb-4">
            Didn't find your answer?
          </h3>
          <p className="text-gray-300 mb-6">
            Our team is here to help. Use our contact form to ask your question
            and we'll get back to you as soon as possible.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Access the contact form
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-12 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1 - About */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-gradient mb-4">
              <Info className="w-5 h-5 inline-block mr-2" />
              Information
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/testimonials"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Events
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 - Links */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-gradient mb-4">
              <Link2 className="w-5 h-5 inline-block mr-2" />
              Helpful Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/services"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-gradient mb-4">
              <Briefcase className="w-5 h-5 inline-block mr-2" />
              Our Services
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/brands"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Brands List
                </a>
              </li>
              <li>
                <a
                  href="/order"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Order
                </a>
              </li>
              <li>
                <a
                  href="/returns"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Returns & Exchange
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-gradient mb-4">
              <PhoneCall className="w-5 h-5 inline-block mr-2" />
              Contact Us
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+33 9999 999 999</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:contact@dazlng.com"
                  className="hover:text-primary transition-colors"
                >
                  contact@dazlng.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5 - Newsletter */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-gradient mb-4">
              Subscribe Now
            </h4>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-gray-300"
                />
                <button className="mt-2 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
              <div className="flex gap-4 mt-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-gray-800 text-center text-gray-400 text-sm">
          <div className="flex justify-between items-center">
            <p>© 2024 DazLng | All Rights Reserved</p>
            <div className="flex gap-4">
              <a href="/faq" className="hover:text-primary transition-colors">
                FAQ
              </a>
              <a
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy
              </a>
              <a href="/terms" className="hover:text-primary transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </PageContainer>
  );
}
