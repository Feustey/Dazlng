"use client";

import * as React from "react";

import { Globe, MessageSquare, Shield, Zap } from "lucide-react";

import { Card } from "@/app/components/ui/card";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesProps {
  content: {
    title: string;
    items: Feature[];
  };
}

export default function Features({ content }: FeaturesProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {content.title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.items.map((feature, index) => (
            <Card key={index} className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                {feature.icon === "zap" && (
                  <Zap className="h-6 w-6 text-primary" />
                )}
                {feature.icon === "shield" && (
                  <Shield className="h-6 w-6 text-primary" />
                )}
                {feature.icon === "globe" && (
                  <Globe className="h-6 w-6 text-primary" />
                )}
                {feature.icon === "message" && (
                  <MessageSquare className="h-6 w-6 text-primary" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
