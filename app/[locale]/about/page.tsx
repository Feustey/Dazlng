"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/card";
import {
  Zap,
  Shield,
  Users,
  Globe,
  Rocket,
  Lightbulb,
  Code2,
  Heart,
} from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("About");

  const values = [
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Innovation",
      description:
        "Nous repoussons les limites de la technologie Lightning Network pour créer des solutions innovantes.",
    },
    {
      icon: <Shield className="w-8 h-8 text-secondary" />,
      title: "Sécurité",
      description:
        "La sécurité de vos actifs et de vos données est notre priorité absolue.",
    },
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      title: "Communauté",
      description:
        "Nous croyons en la puissance de la communauté et en la collaboration.",
    },
  ];

  const team = [
    {
      name: "Stéphane Courant",
      role: "Fondateur & CEO",
      image: "/team/stephane.jpg",
      bio: "Expert en Lightning Network avec plus de 5 ans d'expérience dans le développement de solutions Bitcoin.",
    },
    {
      name: "Alexandre Dubois",
      role: "CTO",
      image: "/team/alexandre.jpg",
      bio: "Ingénieur logiciel spécialisé dans les technologies blockchain et les systèmes distribués.",
    },
    {
      name: "Marie Laurent",
      role: "Head of Design",
      image: "/team/marie.jpg",
      bio: "Designer UX/UI passionnée par la création d'interfaces intuitives et esthétiques.",
    },
  ];

  return (
    <PageContainer
      title="À propos de DazLng"
      subtitle="Notre mission est de démocratiser l'accès au Lightning Network"
    >
      {/* Section Mission */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient">
            Notre Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-300">
                DazLng est né de la conviction que le Lightning Network
                représente l'avenir des paiements Bitcoin. Notre mission est de
                rendre cette technologie accessible à tous, des particuliers aux
                entreprises.
              </p>
              <p className="text-gray-300">
                Nous développons des solutions innovantes qui simplifient
                l'utilisation du Lightning Network, tout en maintenant les plus
                hauts standards de sécurité et de performance.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Globe className="w-32 h-32 text-primary/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Valeurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {values.map((value, index) => (
          <Card
            key={index}
            className="p-6 hover:scale-[1.02] transition-transform duration-300"
          >
            <CardHeader>
              <div className="mb-4">{value.icon}</div>
              <CardTitle className="text-xl font-semibold text-gradient">
                {value.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section Équipe */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient">
            Notre Équipe
          </CardTitle>
          <CardDescription className="text-gray-300">
            Une équipe passionnée dédiée à l'innovation dans le Lightning
            Network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="p-6 hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gradient">
                    {member.name}
                  </h3>
                  <p className="text-primary mb-2">{member.role}</p>
                  <p className="text-gray-300">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient">
            Notre Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Rocket className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold text-gradient">
                    10,000+ Nœuds
                  </h3>
                  <p className="text-gray-300">
                    Nœuds Lightning déployés dans le monde
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Lightbulb className="w-8 h-8 text-secondary" />
                <div>
                  <h3 className="text-xl font-semibold text-gradient">
                    50+ Pays
                  </h3>
                  <p className="text-gray-300">
                    Présence internationale avec des utilisateurs actifs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Code2 className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="text-xl font-semibold text-gradient">
                    100% Open Source
                  </h3>
                  <p className="text-gray-300">
                    Contribuons activement à l'écosystème
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Heart className="w-32 h-32 text-primary/20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
