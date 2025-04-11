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
import { Shield, Lock, Eye, Server, Key } from "lucide-react";

export default function PrivacyPage() {
  const t = useTranslations("Privacy");

  const privacyPrinciples = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Data Protection",
      description:
        "We use advanced encryption protocols to protect your personal data and transactions.",
    },
    {
      icon: <Lock className="w-6 h-6 text-secondary" />,
      title: "Access Control",
      description:
        "You maintain full control of your private keys and funds. We never store your sensitive information.",
    },
    {
      icon: <Eye className="w-6 h-6 text-accent" />,
      title: "Transparency",
      description:
        "We are transparent about our data collection and usage practices. Our code is open-source.",
    },
    {
      icon: <Server className="w-6 h-6 text-primary" />,
      title: "Server Security",
      description:
        "Our servers are secured and regularly audited. We use state-of-the-art security protocols.",
    },
  ];

  const dataCollection = [
    {
      title: "Login Data",
      description:
        "We only collect the information necessary to provide our services: email address, username, and public key.",
    },
    {
      title: "Transaction Data",
      description:
        "Lightning transactions are private by design. We only store information necessary for service operation.",
    },
    {
      title: "Usage Data",
      description:
        "We collect anonymous data about service usage to improve user experience.",
    },
  ];

  return (
    <PageContainer
      title="Privacy Policy"
      subtitle="Protecting your data and respecting your privacy"
    >
      {/* Section Principles */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient">
            Our Privacy Principles
          </CardTitle>
          <CardDescription className="text-gray-300">
            Protecting your data is our top priority
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {privacyPrinciples.map((principle, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {principle.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gradient">
                      {principle.title}
                    </h3>
                    <p className="text-gray-300 mt-1">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Data Collection */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient">
            Data Collection and Usage
          </CardTitle>
          <CardDescription className="text-gray-300">
            We only collect data necessary for service operation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {dataCollection.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gradient mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient">
            Security Measures
          </CardTitle>
          <CardDescription className="text-gray-300">
            We implement comprehensive measures to protect your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gradient">
                Data Protection
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <Key className="w-5 h-5 text-primary mt-0.5" />
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <span>Two-factor authentication</span>
                </li>
                <li className="flex items-start gap-2">
                  <Server className="w-5 h-5 text-primary mt-0.5" />
                  <span>Regular and secure backups</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gradient">
                Your Rights
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <Eye className="w-5 h-5 text-primary mt-0.5" />
                  <span>Access to your personal data</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="w-5 h-5 text-primary mt-0.5" />
                  <span>Modify or delete your data</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <span>Data portability</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
